/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable unicorn/prevent-abbreviations */
import path from 'path';
import fs from 'fs-extra';
import { execSync } from 'child_process';

const repoFolder = process.cwd();

export const walkFilesAsync = async (dir, callback) => {
  const statObj = fs.statSync(dir);
  if (statObj.isFile()) {
    callback(dir);
  } else {
    const dirs = fs.readdirSync(dir);
    await Promise.all(dirs.map((item) => walkFilesAsync(path.join(dir, item), callback)));
  }
};

/**
 * 执行命令行指令，并打印该指令的结果
 * @param {string} command 要执行的命令
 * @param {ExecSyncOptionsWithStringEncoding} options 执行指令时的附带参数
 * @param {boolean} output 是否输出
 */
export const shell = (command, options, output) => {
  if (options !== undefined) options = {};
  execSync(command, {
    cwd: repoFolder,
    stdio: output ? 'inherit' : [('inherit', 'ignore', 'ignore')],
    ...options,
  });
};

/**
 * 执行命令行指令，并打印该指令的结果，同时忽略任何错误
 * @param {string} command 要执行的命令
 * @param {ExecSyncOptionsWithStringEncoding} options 执行指令时的附带参数
 * @param {boolean} output 是否输出
 */
export const shellI = (command, options, output) => {
  try {
    shell(command, options, output);
  } catch (error) {
    console.error(chalk.red.bold(`[Shell Command Error] ${error}`));
  }
};

export const tryCopy = (from, to) => {
  if (fs.existsSync(from)) fs.copySync(from, to, { overwrite: true });
};

export const htmlMinifierOptions = {
  caseSensitive: true,
  collapseBooleanAttributes: false,
  collapseInlineTagWhitespace: false,
  collapseWhitespace: true,
  conservativeCollapse: true,
  continueOnParseError: true,
  customAttrCollapse: '.*',
  decodeEntities: true,
  html5: true,
  ignoreCustomFragments: ['<#[\\s\\S]*?#>', '<%[\\s\\S]*?%>', '<\\?[\\s\\S]*?\\?>'],
  includeAutoGeneratedTags: false,
  keepClosingSlash: false,
  maxLineLength: 0,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  preserveLineBreaks: false,
  preventAttributesEscaping: false,
  processConditionalComments: true,
  processScripts: ['text/html'],
  removeAttributeQuotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeEmptyElements: false,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: true,
  sortAttributes: true,
  sortClassName: true,
  trimCustomFragments: true,
  useShortDoctype: true,
};
