declare var global: any;
const SPREAD_ID = '';
const logSheet = SpreadsheetApp.openById(SPREAD_ID).getSheetByName('log');
const dataSheet = SpreadsheetApp.openById(SPREAD_ID).getSheetByName('data');

global.doGet = function(e) {
  logSheet.appendRow([new Date(), `start`]);

  let data = dataSheet.getDataRange().getValues();
  let lastIndex = getLastIndex(data);
  var res = [];

  // 最初の行(3行目)から最後の行までのデータを取得
  for (var i = 3; i <= lastIndex; i = i + 2) {
    // 日付
    let cellDate = dataSheet.getRange(i, 1, 1, 1).getValues();
    let date = formatDate(cellDate);

    // 数値
    let value = dataSheet.getRange(i, 2, 1, 12).getValues();

    // 品目
    let name = dataSheet.getRange(i + 1, 2, 1, 12).getValues();

    // 配列に連想配列形式で追加
    res.push({
      id: i - 2,
      date: date,
      value: value,
      name: name
    });
  }
  return createJsonResponse(res);
};

// B列最後のデータが入力されている行数取得
const getLastIndex = function(data): number {
  var index = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i][1] != '') {
      index = i;
    }
  }
  logSheet.appendRow([new Date(), `lastIndex:${index}`]);
  return index;
};

const createJsonResponse = function(data: object) {
  const text = JSON.stringify(data);
  const mimeType = ContentService.MimeType.JSON;
  return ContentService.createTextOutput(text).setMimeType(mimeType);
};

/* 日付フォーマット **/
function formatDate(input): String {
  var dayDate = new Date(input);
  var date = dayDate.getFullYear() + '/' + (dayDate.getMonth() + 1) + '/' + dayDate.getDate();
  return date;
}

export interface Data {
  id: number;
  date: String;
  value: object[];
  name: object[];
}

global.doPost = function(e) {};
