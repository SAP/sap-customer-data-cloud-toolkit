import {
	Card,
	CardHeader,
	Input,
	InputType,
	Select,
	MultiComboBox,
	MultiComboBoxItem,
	Option,
	Label,
	Bar,
	Title,
	Text,
	TitleLevel,
	FlexBox,
	Button,
} from '@ui5/webcomponents-react'
import { spacing } from '@ui5/webcomponents-react-base'
import '@ui5/webcomponents-icons/dist/navigation-down-arrow.js'
import '@ui5/webcomponents-icons/dist/navigation-right-arrow.js'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/decline.js'
import '@ui5/webcomponents-icons/dist/overflow.js'

import { useState } from 'react'

import SitesTable from '../../components/sites-table/sites-table.component'

import dataCenters from '../../dataCenters.json'
import structures from '../../sitesStructures.json'

import { useSelector, useDispatch } from 'react-redux'
import { addParent, clearSites } from '../../redux/siteSlice'

const BarStart = (props) => (
	<Title
		level={TitleLevel.H3}
		slot={props.slot}
		style={spacing.sapUiSmallMarginBegin}
	>
		<span style={spacing.sapUiTinyMarginBegin}>Site Deployer</span>
	</Title>
)

const SiteDeployer = () => {
	const dispatch = useDispatch()

	const sites = useSelector((state) => state.sites.sites)

	const [selectedStructureId, setSelectedStructureId] = useState()
	const [baseDomain, setBaseDomain] = useState()

	const onSaveHandler = () => {
		console.log(sites)
	}

	const onCancelHandler = () => {
		dispatch(clearSites())
	}

	const onChangeSiteStructure = (event) => {
		setSelectedStructureId(event.detail.selectedOption.dataset.value)
	}

	const onCreateHandler = () => {
		const selectedDataCenters = getSelectedDataCenters()
		const selectedtructure = getSelectedStructure()

		dispatch(clearSites())

		selectedDataCenters.forEach((dataCenter) => {
			selectedtructure.data.forEach((structure) => {
				dispatch(
					addParent({
						baseDomain: tryGetBaseDomainFromStructure(structure),
						description: structure.description,
						dataCenter: dataCenter,
						childSites: structure.childSites,
					}),
				)
			})
		})
	}

	const tryGetBaseDomainFromStructure = (structure) => {
		return baseDomain !== '' ? baseDomain : structure.baseDomain
	}

	const getSelectedStructure = () => {
		return structures.filter(
			(siteStructure) => siteStructure._id === selectedStructureId,
		)[0]
	}

	const getSelectedDataCenters = () => {
		const dataCenterHTMLCollection = document.getElementById(
			'cdctools-dataCenter',
		).children

		return [...dataCenterHTMLCollection]
			.filter((item) => item._state.selected === true)
			.map((item) => item._state.text)
	}

	const onBaseDomainChange = (event) => {
		setBaseDomain(event.target.value)
	}

	const showHideSaveCancelButtons = () => {
		if (sites.length) {
			return (
				<Bar
					design="FloatingFooter"
					endContent={
						<div>
							<button
								type="submit"
								id="save-main"
								class="fd-button fd-button--emphasized fd-button--compact"
								onClick={onSaveHandler}
							>
								Save
							</button>
							<button
								type="button"
								fd-button=""
								id="cancel-main"
								class="fd-button fd-button--transparent fd-button--compact"
								onClick={onCancelHandler}
							>
								Cancel
							</button>
						</div>
					}
				></Bar>
			)
		}
	}

	return (
		<div className="cdc-tools-app-container" name="site-deployer">
			<Bar design="Header" startContent={<BarStart />}></Bar>
			<div style={{ overflow: 'scroll', height: 'calc(100vh - 100px)' }}>
				<div style={spacing.sapUiSmallMargin}>
					<div style={spacing.sapUiTinyMargin}>
						<FlexBox style={spacing.sapUiSmallMarginBottom}>
							<Text style={{ color: 'var(--sapNeutralElementColor)' }}>
								Use Site Structures to quickly create complex implementations
								from a curated list of structures based on best practices.
							</Text>
						</FlexBox>
						<Card header={<CardHeader titleText="Site Structures" />}>
							<FlexBox justifyContent="SpaceBetween">
								<div
									style={{
										...spacing.sapUiSmallMargin,
										textAlign: 'left',
										width: '100%',
									}}
								>
									<Label
										for="cdctools-siteDomain"
										style={{ ...spacing.sapUiTinyMarginTopBottom }}
									>
										Site Domain: *
									</Label>
									<Input
										id="cdctools-siteDomain"
										type={InputType.Text}
										style={{ width: '100%' }}
										placeholder="e.g. mysite.com"
										onInput={(event) => {
											onBaseDomainChange(event)
										}}
									/>
								</div>
								<div
									style={{
										...spacing.sapUiSmallMargin,
										textAlign: 'left',
										width: '100%',
									}}
								>
									<Label
										for="cdctools-dataCenter"
										style={{ ...spacing.sapUiTinyMarginTopBottom }}
									>
										Choose Data Centers: *
									</Label>
									<MultiComboBox
										id="cdctools-dataCenter"
										style={{ width: '100%' }}
									>
										{dataCenters.map(({ value }) => (
											<MultiComboBoxItem key={value} text={value} selected />
										))}
									</MultiComboBox>
								</div>
							</FlexBox>

							<div
								style={{
									...spacing.sapUiSmallMargin,
									marginTop: 0,
									textAlign: 'left',
								}}
							>
								<Label
									for="cdctools-siteStructure"
									style={{ ...spacing.sapUiTinyMarginTopBottom }}
								>
									Select a Site Structure: *
								</Label>

								<Select
									id="cdctools-siteStructure"
									style={{ width: '100%' }}
									onChange={onChangeSiteStructure}
									required="true"
								>
									<Option></Option>
									{structures.map(({ _id, name }) => (
										<Option key={_id} value={_id} data-value={_id}>
											{name}
										</Option>
									))}
								</Select>
							</div>
							<div style={{ textAlign: 'center' }}>
								<Button
									onClick={onCreateHandler}
									icon="add"
									design="Transparent"
									style={{ display: 'block' }}
								>
									Create
								</Button>
							</div>
						</Card>
					</div>
				</div>
				<div style={spacing.sapUiSmallMargin}>
					<div style={spacing.sapUiTinyMargin}>
						<Card
							header={
								<CardHeader
									titleText="Site Creation Preview"
									subtitleText="Quickly add or remove sites, change the structure, update the domains naming, description and select data centers."
									// subtitleText="Quickly change the domains naming and structure. You can also set policies, and other configurations to be copied from an existing site seed."
								></CardHeader>
							}
						>
							<SitesTable />
						</Card>
					</div>
				</div>
				<div style={spacing.sapUiSmallMargin}>
					<div style={spacing.sapUiTinyMargin}>
						<Card>{showHideSaveCancelButtons()}</Card>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SiteDeployer
