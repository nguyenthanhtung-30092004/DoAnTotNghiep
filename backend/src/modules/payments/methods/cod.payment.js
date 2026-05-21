class CodPayment {
  async createPayment() {
    return {
      paymentUrl: "",
      paymentStatus: "PENDING",
    };
  }
}

module.exports = new CodPayment();
