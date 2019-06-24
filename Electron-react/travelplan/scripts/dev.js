'use strict'

const chalk = require('chalk');
const { spawn } = require('child_process');

let electronProcess = null;
let reactProcess = null;

var lastReactLogInfo = {
  data: "",
  content: "",
  lineNum: 0,
  type: -1, // 0为非替换文本，1为替换文本
}

function reactLog (data, type) {
  
  var tempLastInfo = lastReactLogInfo;

  if (tempLastInfo.type === type && type === 0) {
    data = tempLastInfo.data + data;
  }

  let color = type === 1 ? "red" : "blue";
  let log = '';
  var tempData = data.toString().split(/\r?\n/);
  tempData.forEach(line => {
    log += `  ${line}\n`;
  });
  if (/[0-9A-z]+/.test(log)) {
    if (tempLastInfo.lineNum > 0 && (tempLastInfo.type === type || type === 0)) {
      process.stdout.cursorTo(0, process.stdout.rows - tempLastInfo.lineNum);
      process.stdout.clearScreenDown();
    }

    lastReactLogInfo.data = data;
    lastReactLogInfo.content = log;
    lastReactLogInfo.lineNum = (tempData.length + 4);
    lastReactLogInfo.type = type;
    process.stdout.write(
      chalk[color].bold('┏ react ------------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    reactProcess = spawn("node", ["scripts/start.js"]);

    reactProcess.stdout.on('data', data => {
      var tempFinished = false;
      if (!electronProcess && data.toString().indexOf("To create a production build, use npm run build.") >= 0) {
        tempFinished = true;
      }
      reactLog(data, 0);

      if (tempFinished) {
        resolve();
      }
    })
    reactProcess.stderr.on('data', data => {
        reactLog(data, 1);
    })

    reactProcess.on('message', data => {
      console.log("message", data);
    })

    reactProcess.on('error', (error) => {
      console.log("reactProcess error", error);
    });

    reactProcess.on('close', () => {
        console.log("reactProcess close");
        if (electronProcess) {
            electronProcess.exit();
            electronProcess = null;
        }
        process.exit()
    })
  })
}

function startElectron () {
    process.env.runtype = "dev";
    electronProcess = spawn("electron", ["."]);
    
    electronProcess.stdout.on('data', data => {
        electronLog(data, 'blue')
    })
    electronProcess.stderr.on('data', data => {
        electronLog(data, 'red')
    })

    electronProcess.on('close', () => {
        if (reactProcess) {
            reactProcess.exit();
            reactProcess = null;
        }
        
        process.exit()
    })
}

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    lastReactLogInfo = {
      data: "",
      content: "",
      lineNum: 0,
      type: -1,
    }
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

function init () {
  Promise.all([startRenderer()])
    .then(() => {
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()