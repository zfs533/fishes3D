/**
 * @author
 * excel文件编写规则
 * 第一行:变量字段名
 * 第二行:变量字段的类型,number,string,any[]
 * 输出,写包含数据的ts类文件
 */
// npm install node-xlsx --save
var xlsx = require('node-xlsx');
const fs = require('fs');

// 解析得到文档中的所有 sheet
var sheets = xlsx.parse('data.xlsx');

// 遍历 sheet
sheets.forEach(function (sheet) {
    var sheetName = sheet.name;
    //读取表格内容
    var data = sheet.data;
    //第一行,字段名字
    //第二行,字段类型
    var inter = `export interface in${sheetName} {\n`;
    for (var i = 0; i < data[0].length; i++) {
        inter += `\t${data[0][i]} : ${data[1][i]},\n`
    }
    inter += "}\n\n";
    //以json格式封装数据
    let body = `export class ${sheetName}Data {\n\t public static data:in${sheetName}[] = [\n`;
    for (var i = 2; i < data.length; i++) {
        if (data[i].length < 1) continue;
        let item = "\t\t{"
        for (var j = 0; j < data[i].length; j++) {
            if (`${data[1][j]}` == 'string') {
                item += `${data[0][j]} : "${data[i][j]}", `;
            }
            else {
                item += `${data[0][j]} : ${data[i][j]}, `;
            }
        }
        item += "},\n";
        body += item;
    }
    body += "\t]\n}\n";
    let script = inter + body;
    //写ts文件
    fs.writeFile(`../assets/script/data/${sheetName}Data.ts`, script, err => {
        if (err) {
            console.error(err)
            console.log(`文件 ${sheetName}Data 导出失败`);
            return
        }
        console.log(`文件 ${sheetName}Data 导出完成`);
    })
});

//example: node readExcl.js


/*

export interface test {
    id: number,
    age: number,
}

export class testData {
    public static td: test[] = [];

}

*/