const originalFileReader = window.FileReader 

class FileReaderMock {
  read(file) {
    const name = file ? (file.name || file) : null
    if (FileReaderMock.resultByFile[name]) {
      return this.result = FileReaderMock.resultByFile[name]
    }
  }
  readAsText(file) {
    if (this.read(file)) {
      this.onload()
    }
  }
  readAsArrayBuffer(file) {
    if (this.read(file)) {
      this.onload({
        target: {result: this.result}
      })
    }
  }
}

FileReaderMock.resultByFile = {}
FileReaderMock.resetMock = () => {
  window.FileReader = FileReaderMock
}
FileReaderMock.unmock = () => {
  window.FileReader = originalFileReader
}

export default FileReaderMock