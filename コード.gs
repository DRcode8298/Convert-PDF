const File_Converter = () => {
  const file = DriveApp.getFileById("1twzdShtyJIDj0Sutp04QrjnIMwRxqkVu").getDownloadUrl();
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

  const return_Payload = JSON.parse(UrlFetchApp.fetch(Fetch_URL,option));
  const jpg_URL = return_Payload.data.tasks[0].result.files[0].url;
  Logger.log(return_Payload)
  Logger.log(jpg_URL)
}
