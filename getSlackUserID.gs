function getSlackUser() {
  
  //必要に応じて書き換える変数
  //Bot User OAuth Token
  const slack_app_token = "xoxb-"; 
  //スプシのURL
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/";
  //スプレッドシートの中の書き込みたいシート名
  const SHEET_NAME = "slackID";　

  //おまじない部分
  const options = {
    "method" : "get",
    "contentType": "application/x-www-form-urlencoded",
    "payload" : { 
      "token": slack_app_token
    }
  };
  const url = "https://slack.com/api/users.list";
  const response = UrlFetchApp.fetch(url, options);
  const members = JSON.parse(response).members;

  
  let arr = [];
  for (const member of members) {
    //削除済、botユーザー、Slackbotを除く
    if (!member.deleted && !member.is_bot && member.id !== "USLACKBOT") {
      let id = member.id;
      let real_name = member.real_name; //氏名(※表示名ではない)
      let name = member.profile.display_name; 
      arr.push([real_name,id,name]);
    }
  }
  
  //スプレッドシートに書き込み
  var spreadSheet = SpreadsheetApp.openByUrl(SHEET_URL);
  const sheet = spreadSheet.getSheetByName(SHEET_NAME);

  //セルを初期化
  sheet.getRange(3, 2, sheet.getMaxRows()-1, 2).clearContent();
  //セルに書き込み
  sheet.getRange(3, 2, arr.length, arr[0].length).setValues(arr);
  
}