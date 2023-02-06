/**
 * If the file is not shared with Google Drive, you will need to share the file with Google Drive.
 * googleドライブにてファイルが共有されていない場合は共有してください。
 */
const File_Converter = () => {
  const file = getFileByUrl(ScriptProperties.getProperty("File_URL")).getDownloadUrl();//JavaScriptを使用する場合はここを通常のURLに変更してください。
  const Fetch_URL = "https://sync.api.cloudconvert.com/v2/jobs";
  const payload = {
    "tasks": {
      "Drive_file": {
        "operation": "import/url",
        "url": file,
        "filename": "drive.pdf"
      },
      "converting": {
        "operation": "convert",
        "output_format": "jpg",
        "input": [
          "Drive_file"
        ]
      },
      "download_url": {
        "operation": "export/url",
        "input": [
          "converting"
        ],
        "inline": false,
        "archive_multiple_files": false
      }
    },
    "tag": "jobbuilder"
  }

  const option = {
    "method": "POST",
    "payload": JSON.stringify(payload),
    "headers": {
      "Content-type": "application/json",
      "Authorization": "Bearer " + ScriptProperties.getProperty("API-Key")
    },
    "muteHttpExceptions": true
  }
  try {
    const return_Payload = JSON.parse(UrlFetchApp.fetch(Fetch_URL, option));
    const jpg_URL = return_Payload.data.tasks[0].result.files[0].url;
    Logger.log(return_Payload)
    Logger.log(jpg_URL)
  } catch (e) {
    Logger.log(e);
  }
}

// URLからファイルを取得する
function getFileByUrl(url) {
  const info = getIdAndResourcekeyByUrl(url, false)
  if (info['resourcekey']) {
    return DriveApp.getFileByIdAndResourceKey(info['id'], info['resourcekey'])
  } else {
    return DriveApp.getFileById(info['id'])
  } 
}

// アイテム情報オブジェクトを取得する
function getIdAndResourcekeyByUrl(url, isFolder = true) {
  return {
    'id': getIdByUrl(url, isFolder),
    'resourcekey': getQueryParamsByUrl(url)['resourcekey']
  }
}

// URLからアイテムIDを取得する
function getIdByUrl(url, isFolder = true) {
  if (!url || url === '') {
    throw Error('無効なURL')
  }

  // スラッシュでURLを分割
  const splitedUrl = url.split('/')
  // idの前に来る特定の文字列
  let searchString = 'd'
  if (isFolder) {
    searchString = 'folders'
  }

  let id = ''
  for (let i = 0; i < splitedUrl.length; i++) {
    // 特定の文字列に一致する場合はidを取得
    if (splitedUrl[i] === searchString && splitedUrl[i + 1]) {
      id = splitedUrl[i + 1]
      break
    }
  }

  // クエリパラメータは除去
  return id.split('?')[0]
}

// URLからクエリパラメータを取得
function getQueryParamsByUrl(url) {
  const params = {}

  if (url.split('?').length < 0) {
    // クエリパラメータがない
    return params
  }
  // クエリパラメータの文字列を取得
  const queryUrl = url.split('?')[1]
  if (queryUrl) {
    // パラメータ毎にキーと値を抽出
    const queryRawParams = queryUrl.split('&')
    queryRawParams.forEach(function (value, index) {
      const kv = value.split('=')
      params[kv[0]] = kv[1]
    })
    return params
  }
  // 全てのキーと値を持ったオブジェクトを返却
  return params
}
