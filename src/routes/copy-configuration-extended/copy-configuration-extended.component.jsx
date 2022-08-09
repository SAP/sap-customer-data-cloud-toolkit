import { Card, CardHeader, Text } from '@ui5/webcomponents-react';
import { spacing } from '@ui5/webcomponents-react-base';

const CopyConfigurationExtended = () => {
  const handleHeaderClick = () => {
    alert('Header clicked');
  };

  return (
    <div className="cdc-tools-app-container" name="copy-configuration-extended">
      <h1>copy-configuration-extended</h1>
    </div>
  );
};

export default CopyConfigurationExtended;
