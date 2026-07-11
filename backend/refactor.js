const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const allFiles = getAllFiles(srcDir);
const fileMap = new Map(); // old absolute path -> new absolute path

// 1. Compute new paths
allFiles.forEach(filePath => {
  const ext = path.extname(filePath);
  if (ext !== '.js') return;

  const relPath = path.relative(srcDir, filePath);
  let newRelPath = relPath;

  // Rule: configs -> config
  if (relPath.startsWith('configs\\') || relPath.startsWith('configs/')) {
    newRelPath = relPath.replace(/^configs[\/\\]/, 'config\\');
  }
  // Rule: socket -> sockets
  else if (relPath.startsWith('socket\\') || relPath.startsWith('socket/')) {
    newRelPath = relPath.replace(/^socket[\/\\]/, 'sockets\\');
  }
  // Rule: auth/checkAuth.js -> middlewares/checkAuth.js
  else if (relPath === 'auth\\checkAuth.js' || relPath === 'auth/checkAuth.js') {
    newRelPath = 'middlewares\\checkAuth.js';
  }
  // Rule: modules/*
  else if (relPath.startsWith('modules\\') || relPath.startsWith('modules/')) {
    const fileName = path.basename(filePath);
    if (fileName.includes('.controller.')) {
      newRelPath = path.join('controllers', fileName);
    } else if (fileName.includes('.service.')) {
      // check if it is in payments/methods
      if (relPath.includes('payments\\methods') || relPath.includes('payments/methods')) {
         newRelPath = path.join('services', 'methods', fileName);
      } else {
         newRelPath = path.join('services', fileName);
      }
    } else if (fileName.includes('.payment.')) {
      newRelPath = path.join('services', 'methods', fileName);
    } else if (fileName.includes('.route.')) {
      newRelPath = path.join('routes', fileName);
    } else if (fileName.includes('.validation.')) {
      newRelPath = path.join('validations', fileName);
    } else if (fileName.includes('.helper.')) {
      newRelPath = path.join('helpers', fileName);
    } else if (fileName.includes('.model.')) {
      newRelPath = path.join('models', fileName);
    } else if (fileName.includes('.constants.')) {
      newRelPath = path.join('constants', fileName);
    } else {
      // fallback just put in utils? Or keep?
      // Wait, let's keep it in its place but under utils maybe?
      console.log('Unmatched module file:', relPath);
    }
  }

  if (relPath !== newRelPath) {
    fileMap.set(filePath, path.join(srcDir, newRelPath));
  } else {
    fileMap.set(filePath, filePath); // same location
  }
});

// Map of old path (without ext) -> new path
const resolveMap = new Map();
for (const [oldP, newP] of fileMap.entries()) {
  const oldNoExt = oldP.replace(/\.js$/, '');
  resolveMap.set(oldNoExt, newP);
}

// 2. Read contents and replace requires
const updatedContents = new Map();

allFiles.forEach(filePath => {
  if (path.extname(filePath) !== '.js') return;

  let content = fs.readFileSync(filePath, 'utf8');
  const newFilePath = fileMap.get(filePath);
  const newFileDir = path.dirname(newFilePath);
  
  // Regex to match require('./...') or require("../...")
  const requireRegex = /require\(['"](\.[^'"]+)['"]\)/g;
  
  content = content.replace(requireRegex, (match, reqPath) => {
    // reqPath is the relative path
    const oldDir = path.dirname(filePath);
    let absReqPath = path.resolve(oldDir, reqPath);
    
    // It might not have .js extension
    let targetNewPath = null;
    if (resolveMap.has(absReqPath)) {
      targetNewPath = resolveMap.get(absReqPath);
    } else if (fileMap.has(absReqPath + '.js')) {
      targetNewPath = fileMap.get(absReqPath + '.js');
    }
    
    if (targetNewPath) {
      // compute new relative path
      let newRelPath = path.relative(newFileDir, targetNewPath);
      // convert back to posix style
      newRelPath = newRelPath.replace(/\\/g, '/');
      // remove .js extension if it wasn't there
      if (!reqPath.endsWith('.js') && newRelPath.endsWith('.js')) {
        newRelPath = newRelPath.replace(/\.js$/, '');
      }
      if (!newRelPath.startsWith('.')) {
        newRelPath = './' + newRelPath;
      }
      return `require('${newRelPath}')`;
    }
    
    return match; // unchanged if not found in our map
  });

  updatedContents.set(filePath, content);
});

// 3. Write files to new locations
for (const [filePath, content] of updatedContents.entries()) {
  const newFilePath = fileMap.get(filePath);
  
  // Ensure dir exists
  const targetDir = path.dirname(newFilePath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.writeFileSync(newFilePath, content, 'utf8');
  
  // Remove old file if it moved
  if (filePath !== newFilePath) {
    fs.unlinkSync(filePath);
  }
}

console.log('Refactor completed.');
