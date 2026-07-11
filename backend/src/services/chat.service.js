const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Conversation, Message } = require('../models/chat.model');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const Brand = require('../models/brand.model');

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const getGeminiModel = () => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
};

let cachedStoreContext = "";
let lastCacheTime = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 phút

const getDynamicContext = async () => {
  const now = Date.now();
  if (cachedStoreContext && now - lastCacheTime < CACHE_DURATION) {
    return cachedStoreContext;
  }

  try {
    const categories = await Category.find({}).select("name");
    const brands = await Brand.find({}).select("name");
    const products = await Product.find({ isDeleted: false, isPublished: true })
      .populate("category", "name")
      .populate("brand", "name")
      .select("name minPrice maxPrice category brand")
      .limit(80); // Giới hạn 80 sản phẩm để tránh tràn token của Gemini

    let context = `Bạn là một nhân viên hỗ trợ khách hàng thân thiện và chuyên nghiệp của RunVault - một cửa hàng chuyên bán đồ thể thao, giày thể thao và phụ kiện chạy bộ.
- Luôn trả lời bằng tiếng Việt, nhiệt tình và lễ phép (Dạ, vâng, ạ).
- Cung cấp thông tin ngắn gọn, súc tích và hữu ích, dựa trên danh sách sản phẩm thực tế của cửa hàng.
- Trình bày câu trả lời thành các đoạn văn ngắn, dễ đọc, có dấu xuống dòng ngăn cách các ý (không viết liền 1 cục). Hạn chế dùng ký tự đánh dấu (*, **).
- Nếu khách hàng hỏi về một đôi giày chạy bộ hoặc món đồ thể thao, hãy tìm trong danh sách dưới đây để tư vấn mẫu phù hợp.
- TUYỆT ĐỐI KHÔNG TỰ BỊA RA SẢN PHẨM KHÔNG CÓ TRONG DANH SÁCH. Nếu không có mẫu phù hợp, hãy nói rõ.
- Nếu khách hàng hỏi về giá cả, hãy dùng giá tham khảo trong danh sách và báo khách lên web xem chi tiết.
- Nếu bạn không biết câu trả lời, hãy nói "Dạ, vấn đề này em chưa rõ, để em chuyển cho bộ phận CSKH trực tiếp hỗ trợ mình nhé ạ".

*** DANH MỤC CỦA CỬA HÀNG ***
- Danh mục: ${categories.map((c) => c.name).join(", ")}
- Thương hiệu: ${brands.map((b) => b.name).join(", ")}

*** SẢN PHẨM HIỆN ĐANG BÁN ***
`;

    products.forEach((p) => {
      const cat = p.category ? p.category.name : "Khác";
      const brand = p.brand ? p.brand.name : "Khác";
      const priceStr =
        p.minPrice === p.maxPrice
          ? `${p.minPrice?.toLocaleString("vi-VN")}đ`
          : `${p.minPrice?.toLocaleString("vi-VN")}đ - ${p.maxPrice?.toLocaleString("vi-VN")}đ`;
      context += `+ ${p.name} (Hãng: ${brand}, Loại: ${cat}, Giá: ${priceStr})\n`;
    });

    cachedStoreContext = context;
    lastCacheTime = now;
    return context;
  } catch (err) {
    console.error("Lỗi lấy dữ liệu cửa hàng cho AI:", err);
    return `Bạn là nhân viên hỗ trợ khách hàng của RunVault - cửa hàng đồ thể thao. Hãy nhiệt tình giải đáp thắc mắc.`;
  }
};

class ChatService {
  async getOrCreateConversation(userId, sessionId) {
    let query = userId ? { userId } : { sessionId };
    let conversation = await Conversation.findOne({
      ...query,
      status: "active",
    });

    if (!conversation) {
      conversation = await Conversation.create({
        userId: userId || null,
        sessionId: sessionId || null,
        status: "active",
      });
    }
    return conversation;
  }

  async getMessages(conversationId) {
    return Message.find({ conversationId }).sort({ createdAt: 1 });
  }

  async getAllActiveConversations() {
    return Conversation.find({ status: "active" })
      .populate("userId", "fullName email avatar")
      .sort({ lastMessageAt: -1 });
  }

  async saveMessage(conversationId, sender, text) {
    const msg = await Message.create({ conversationId, sender, text });

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageAt: new Date(),
    });

    return msg;
  }

  async getGeminiResponse(conversationId, userText) {
    try {
      const model = getGeminiModel();
      if (!model) {
        return "Xin lỗi, hiện tại hệ thống AI đang bảo trì. Vui lòng thử lại sau hoặc chờ nhân viên hỗ trợ.";
      }

      const historyRaw = await Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .limit(20);

      historyRaw.reverse();

      if (
        historyRaw.length > 0 &&
        historyRaw[historyRaw.length - 1].text === userText
      ) {
        historyRaw.pop();
      }

      const formattedHistory = [];
      let lastRole = null;

      for (const msg of historyRaw) {
        const role = msg.sender === "user" ? "user" : "model";
        if (role === lastRole) {
          formattedHistory[formattedHistory.length - 1].parts[0].text +=
            "\n" + msg.text;
        } else {
          formattedHistory.push({ role, parts: [{ text: msg.text }] });
          lastRole = role;
        }
      }
      const dynamicPrompt = await getDynamicContext();

      // Lấy toàn bộ lịch sử thô, bao gồm cả prompt ban đầu
      const fullHistoryRaw = [
        { role: "user", parts: [{ text: dynamicPrompt }] },
        {
          role: "model",
          parts: [
            {
              text: "Vâng, em đã nắm rõ thông tin danh sách sản phẩm thể thao của cửa hàng. Em đã sẵn sàng tư vấn ạ.",
            },
          ],
        },
        ...formattedHistory,
      ];

      // Gộp liên tiếp để đảm bảo history luôn luân phiên user -> model -> user -> model
      const finalHistory = [];
      let currentRole = null;
      for (const item of fullHistoryRaw) {
        if (item.role === currentRole) {
          finalHistory[finalHistory.length - 1].parts[0].text += "\n" + item.parts[0].text;
        } else {
          finalHistory.push(item);
          currentRole = item.role;
        }
      }

      let finalUserText = userText;
      // Đảm bảo phần tử cuối cùng trong history là 'model', nếu là 'user' thì gộp vào finalUserText
      if (finalHistory.length > 0 && finalHistory[finalHistory.length - 1].role === "user") {
        const lastUserMsg = finalHistory.pop();
        finalUserText = lastUserMsg.parts[0].text + "\n" + userText;
      }

      const chat = model.startChat({
        history: finalHistory,
      });

      const result = await chat.sendMessage(finalUserText);
      const responseText = result.response.text();

      return responseText;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Xin lỗi, có một chút sự cố khi xử lý yêu cầu của bạn. Nhân viên của chúng tôi sẽ phản hồi bạn sớm nhất.";
    }
  }
}

module.exports = new ChatService();
