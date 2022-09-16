import React from "react";
import { shallow } from 'enzyme'

import SiteDeployer from './site-deployer.component'

test('shoud render', () => {
    console.log('shallow(<SiteDeployer/>)')
    console.log(shallow(<SiteDeployer/>))
    expect(shallow(<SiteDeployer/>).length).toEqual(1)
})
