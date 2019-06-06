'use strict'

const chalk = require('chalk');
const path = require('path');
var readline = require('readline');
const { spawn } = require('child_process');
const electron = require('electron');
const VueCliService = require('@vue/cli-service');
// const WebpackDevServer = require('webpack-dev-server');

let electronProcess = null;
let vueProcess = null;

var lastVueLogInfo = {
  data: "",
  content: "",
  lineNum: 0,
  type: -1, // 0为非替换文本，1为替换文本
}

function vueLog (data, type) {
  
  var tempLastInfo = lastVueLogInfo;

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

    lastVueLogInfo.data = data;
    lastVueLogInfo.content = log;
    lastVueLogInfo.lineNum = (tempData.length + 4);
    lastVueLogInfo.type = type;
    process.stdout.write(
      chalk[color].bold('┏ vue ------------------------') +
      '\n\n' +
      log +
      chalk[color].bold('┗ ----------------------------') +
      '\n'
    )
  }
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    // let vueCliServiceObject = new VueCliService(path.join(__dirname, '../'));
    // console.log("vueCliServiceObject", vueCliServiceObject);
    // console.log("WebpackDevServer", WebpackDevServer);
    // WebpackDevServer.
    // manualRestart = true;
    // vueCliServiceObject.run('serve');
    vueProcess = spawn("vue-cli-service", ["serve"]);

    vueProcess.stdout.on('data', data => {
      var tempFinished = false;
      if (data.toString().indexOf("To create a production build, run npm run build.") >= 0) {
        tempFinished = true;
      }
      vueLog(data, 0);

      if (tempFinished) {
        resolve();
      }
    })
    vueProcess.stderr.on('data', data => {
      vueLog(data, 1);
    })

    vueProcess.on('message', data => {
      console.log("message", data);
    })

    vueProcess.on('error', (error) => {
      console.log("vueProcess error", error);
    });

    vueProcess.on('close', () => {
      console.log("vueProcess close");
      process.exit()
    })
  })
}

function startElectron () {
  process.env.runtype = "dev";

  // var args = [
  //   // '--inspect=5858',
  //   path.join(__dirname, '../main.js')
  // ]

  // args = args.concat(process.argv.slice(2))
  // console.log("electronProcess args", args);

  // electronProcess = spawn(electron, args)
  electronProcess = spawn("electron", ["."]);
  
  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
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
    lastVueLogInfo = {
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