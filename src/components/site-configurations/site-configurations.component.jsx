import React from 'react';
import { withTranslation } from 'react-i18next';
import { createUseStyles } from 'react-jss';
import { Card, CardHeader, FlexBox, CheckBox, Button } from '@ui5/webcomponents-react'
import ConfigurationTree from '../../components/configuration-tree/configuration-tree.component';
import styles from './site-configurations.styles';

const useStyles = createUseStyles(styles, { name: 'CopyConfigurationExtended' });

const SiteConfigurations = ({
                              siteId,
                              configurations,
                              selectAllCheckboxState,
                              unselectAllIncludeCheckboxState,
                              onSelectAllCheckboxChangeHandler,
                              onSelectAllIncludeUrlChangeHandler,
                              setConfigurationStatus,
                              setDataflowVariableValue,
                              setDataflowVariableValues,
                              t,
                            }) => {
  const classes = useStyles();

  return configurations && configurations.length ? (
    <div className={classes.selectConfigurationOuterDivStyle}>
      <div className={classes.selectConfigurationInnerDivStyle}>
        <Card
          id="siteConfigurationsCard"
          data-cy="siteConfigurationsCard"
          header={
            <CardHeader
              titleText={t('COPY_CONFIGURATION_EXTENDED.SELECT_CONFIGURATION')}
              action={
                <>
                  {/*<CheckBox*/}
                  {/*  id="removeIncludedUrlCheckbox"*/}
                  {/*  data-cy="removeIncludedUrlCheckbox"*/}
                  {/*  checked={unselectAllIncludeCheckboxState}*/}
                  {/*  text={t('COPY_CONFIGURATION_EXTENDED.REMOVE_INCLUDED_URL')}*/}
                  {/*  onChange={onSelectAllIncludeUrlChangeHandler}*/}
                  {/*/>*/}

                  <Button
                    id="removeIncludedUrlButton"
                    data-cy="removeIncludedUrlButton"
                    onClick={() => onSelectAllIncludeUrlChangeHandler({ srcElement: { checked: false } })}
                  >
                    {t('COPY_CONFIGURATION_EXTENDED.REMOVE_INCLUDED_URL_BUTTON')}
                  </Button>

                  <CheckBox
                    id="selectAllCheckbox"
                    data-cy="selectAllCheckbox"
                    checked={selectAllCheckboxState}
                    text={t('COPY_CONFIGURATION_EXTENDED.SELECT_ALL')}
                    onChange={onSelectAllCheckboxChangeHandler}
                  />
                </>
              }
            />
          }
        >
          <FlexBox alignItems="Stretch" direction="Column" justifyContent="Start" wrap="Wrap">
            {configurations.map((configuration) => (
              <ConfigurationTree
                key={configuration.id}
                {...configuration}
                siteId={siteId}
                setConfigurationStatus={setConfigurationStatus}
                setDataflowVariableValue={setDataflowVariableValue}
                setDataflowVariableValues={setDataflowVariableValues}
              />
            ))}
          </FlexBox>
        </Card>
      </div>
    </div>
  ) : (
    ''
  );
};

export default withTranslation()(SiteConfigurations);
