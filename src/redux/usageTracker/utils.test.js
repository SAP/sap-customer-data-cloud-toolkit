/**
 * @jest-environment jsdom
 */
import { initTracker, setTrackUsageDialogStyles } from './utils'

describe('usage tracker utils test suite', () => {
  test('initTracker test', () => {
    const mockTrackingTool = {
      init: jest.fn(),
    }
    initTracker(mockTrackingTool)
    expect(mockTrackingTool.init).toHaveBeenCalledWith({
      apiKey: '4_TCuGT23_GS-FxSIFf3YNdQ',
      dataCenter: 'eu1',
      storageName: 'usageTracking',
    })
  })

  test('setTrackUsageDialogStyles test', () => {
    mockDocumentGetElementById()
    const mockedDialog = document.getElementById()
    const mockedDialogContent = mockedDialog.querySelector('#automated-usage-tracking-tool-dialog-content')
    const mockedDialogFooter = mockedDialog.querySelector('#automated-usage-tracking-tool-dialog-footer')
    const mockedConfirmButton = mockedDialog.querySelector('#automated-usage-tracking-tool-dialog-confirm-button')

    setTrackUsageDialogStyles(mockedDialog)

    expect(mockedDialog.style.width).toEqual('500px')
    expect(mockedDialog.style.borderRadius).toEqual('5px')
    expect(mockedDialog.style.borderColor).toEqual('#fff')

    expect(mockedDialogContent.style.padding).toEqual('8px')
    expect(mockedDialogContent.style.fontFamily).toEqual(`"72override", "72", "72full", Arial, Helvetica, sans-serif`)
    expect(mockedDialogContent.style.fontSize).toEqual('.875rem;')

    expect(mockedDialogFooter.style.display).toEqual('inline-flex')
    expect(mockedDialogFooter.style.flexDirection).toEqual('column')
    expect(mockedDialogFooter.style.width).toEqual('100%')

    expect(mockedConfirmButton.style.color).toEqual('#fff')
    expect(mockedConfirmButton.style.borderColor).toEqual('#0a6ed1')
    expect(mockedConfirmButton.style.backgroundColor).toEqual('#0a6ed1')
    expect(mockedConfirmButton.style.borderRadius).toEqual('.25rem')
    expect(mockedConfirmButton.style.minWidth).toEqual('3.25rem')
    expect(mockedConfirmButton.style.height).toEqual('2.25rem')
    expect(mockedConfirmButton.style.fontFamily).toEqual(`"72override", "72", "72full", Arial, Helvetica, sans-serif`)
    expect(mockedConfirmButton.style.fontSize).toEqual('14px')
    expect(mockedConfirmButton.style.fontWeight).toEqual(700)
    expect(mockedConfirmButton.style.outline).toEqual('auto')
    expect(mockedConfirmButton.style.marginTop).toEqual('8px')
    expect(mockedConfirmButton.style.alignSelf).toEqual('end')
  })
})

function mockDocumentGetElementById() {
  jest.spyOn(document, 'getElementById').mockImplementation(() => {
    const mockedDialog = {
      style: {},
      dialogContent: {
        style: {},
      },
      dialogFooter: {
        style: {},
      },
      confirmButton: {
        style: {},
      },
      querySelector: (id) => {
        switch (id) {
          case '#automated-usage-tracking-tool-dialog-content':
            return mockedDialog.dialogContent
          case '#automated-usage-tracking-tool-dialog-footer':
            return mockedDialog.dialogFooter
          case '#automated-usage-tracking-tool-dialog-confirm-button':
            return mockedDialog.confirmButton
        }
      },
    }
    return mockedDialog
  })
}
