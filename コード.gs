const File_Converter = () => {
  const file = DriveApp.getFileById("1twzdShtyJIDj0Sutp04QrjnIMwRxqkVu").getDownloadUrl();
  Logger.log(file)
  const url = "https://api.cloudconvert.com/v2/jobs";
  const payload = {
    "tasks": {
      "import-1": {
        "operation": "import/url",
        "url": file,
        "filename": "url.pdf"
      },
      "url_convert": {
        "operation": "convert",
        "input_format": "pdf",
        "output_format": "jpg",
        "engine": "poppler",
        "input": [
          "import-1"
        ],
        "pixel_density": 300
      },
      "export-1": {
        "operation": "export/url",
        "input": [
          "url_convert"
        ],
        "inline": false,
        "archive_multiple_files": false
      }
    },
    "tag": "jobbuilder"
  }

  const option = {
    "method": "post",
    "headers": {
      "Authorization": "Bearer "+ScriptProperties.deleteProperty("API_Key"),
      "Content-type": "application/json"
    },
    "data": payload
  }
  Logger.log(UrlFetchApp.fetch(url, option))
}
