const originalFileReader = window.FileReader 

class MockFileReader {
  readAsText(file) {
    if (file === MockFileReader.expectedFile) {
      this.result = MockFileReader.result
      this.onload()
    }
  }
}

MockFileReader.expectedFile = ''
MockFileReader.result = ''
MockFileReader.resetMock = () => {
  window.FileReader = MockFileReader
}
MockFileReader.unmock = () => {
  window.FileReader = originalFileReader
}

export default MockFileReader