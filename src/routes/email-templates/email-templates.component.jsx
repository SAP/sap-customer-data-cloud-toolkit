import { Bar, Button } from '@ui5/webcomponents-react'

const EmailTemplates = () => {
  return (
    <>
      <Bar
        style={{ width: '300px', position: 'absolute', top: '5px', right: '30px', boxShadow: 'none', zIndex: 10, background: 'transparent' }}
        endContent={
          <div>
            <Button className="fd-button fd-button--compact" style={{ marginLeft: '5px' }}>
              Export All
            </Button>
            <Button className="fd-button fd-button--compact" style={{ marginLeft: '5px' }}>
              Import All
            </Button>
          </div>
        }
      ></Bar>
    </>
  )
}

export default EmailTemplates
