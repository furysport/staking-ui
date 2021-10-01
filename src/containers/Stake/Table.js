import React, { Component } from 'react';
import DataTable from '../../components/DataTable';
import './index.css';
import * as PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CircularProgress from '../../components/CircularProgress';
import UnDelegateButton from '../Home/TokenDetails/UnDelegateButton';
import ReDelegateButton from '../Home/TokenDetails/ReDelegateButton';
import DelegateButton from './DelegateButton';
import { commaSeparator } from '../../utils/numberFormats';
import ValidatorName from './ValidatorName';
import { config } from '../../config';
import ConnectButton from '../NavBar/ConnectButton';

class Table extends Component {
    render () {
        const options = {
            responsive: 'standard',
            serverSide: false,
            print: false,
            fixedHeader: false,
            rowsPerPage: 10,
            rowsPerPageOptions: [5, 10, 100],
            sort: false,
            pagination: false,
            selectableRows: 'none',
            selectToolbarPlacement: 'none',
            textLabels: {
                body: {
                    noMatch: this.props.inProgress
                        ? <CircularProgress/>
                        : !this.props.address
                            ? <ConnectButton/>
                            : <div className="no_data_table"> No data found </div>,
                    toolTip: 'Sort',
                },
                viewColumns: {
                    title: 'Show Columns',
                    titleAria: 'Show/Hide Table Columns',
                },
            },
        };

        const columns = [{
            name: 'validator',
            label: 'Validator',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    <ValidatorName value={value}/>
                ),
            },
        }, {
            name: 'status',
            label: 'Status',
            options: {
                sort: false,
                customBodyRender: (value) => (
                    <div className="status" title={value}>
                        {value}
                    </div>
                ),
            },
        }, {
            name: 'voting_power',
            label: 'Voting Power',
            options: {
                sort: true,
                customBodyRender: (value) => (
                    <div className="voting_power">
                        <p>{commaSeparator(parseFloat(value).toFixed(2))}</p>
                    </div>
                ),
            },
        },
        {
            name: 'commission',
            label: 'Commission',
            options: {
                sort: true,
            },
        }, {
            name: 'tokens_staked',
            label: 'Tokens Staked',
            options: {
                sort: true,
                customBodyRender: (item) => {
                    let value = this.props.delegations.find((val) =>
                        (val.delegation && val.delegation.validator_address) === item.operator_address);
                    value = value ? value.balance && value.balance.amount && value.balance.amount / 10 ** config.COIN_DECIMALS : null;

                    return (
                        <div className={value ? 'tokens' : 'no_tokens'}>
                            {value || 'no tokens'}
                        </div>
                    );
                },
            },
        }, {
            name: 'action',
            label: 'Action',
            options: {
                sort: false,
                customBodyRender: (validatorAddress) => (
                    this.props.delegations.find((item) =>
                        (item.delegation && item.delegation.validator_address) === validatorAddress)
                        ? <div className="actions">
                            <ReDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <UnDelegateButton valAddress={validatorAddress}/>
                            <span/>
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                        : <div className="actions">
                            <DelegateButton valAddress={validatorAddress}/>
                        </div>
                ),
            },
        }]
        ;

        let dataToMap = this.props.active === 2 ? this.props.delegatedValidatorList
            : this.props.validatorList;
        if (this.props.home && (dataToMap.length > 6)) {
            dataToMap = dataToMap.slice(0, 6);
        }
        const tableData = dataToMap && dataToMap.length
            ? dataToMap.map((item) =>
                [
                    item,
                    item.status === 1 ? 'unbonding'
                        : item.status === 2 ? 'unbonded'
                            : item.status === 3 ? 'active' : '',
                    (Number(item.tokens) / 1000000).toFixed(1),
                    item.commission && item.commission.commission_rates &&
                    item.commission.commission_rates.rate
                        ? (Number(item.commission.commission_rates.rate) * 100).toFixed(1) + '%' : '',
                    item,
                    item.operator_address,
                ])
            : [];

        return (
            <div className="table">
                <DataTable
                    columns={columns}
                    data={tableData}
                    name="stake"
                    options={options}/>
            </div>
        );
    }
}

Table.propTypes = {
    active: PropTypes.number.isRequired,
    inProgress: PropTypes.bool.isRequired,
    lang: PropTypes.string.isRequired,
    address: PropTypes.string,
    delegatedValidatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
    delegations: PropTypes.arrayOf(
        PropTypes.shape({
            validator_address: PropTypes.string,
            balance: PropTypes.shape({
                amount: PropTypes.any,
                denom: PropTypes.string,
            }),
        }),
    ),
    home: PropTypes.bool,
    validatorList: PropTypes.arrayOf(
        PropTypes.shape({
            operator_address: PropTypes.string,
            status: PropTypes.number,
            tokens: PropTypes.string,
            commission: PropTypes.shape({
                commission_rates: PropTypes.shape({
                    rate: PropTypes.string,
                }),
            }),
            delegator_shares: PropTypes.string,
            description: PropTypes.shape({
                moniker: PropTypes.string,
            }),
        }),
    ),
};

const stateToProps = (state) => {
    return {
        address: state.accounts.address.value,
        lang: state.language,
        validatorList: state.stake.validators.list,
        inProgress: state.stake.validators.inProgress,
        delegations: state.accounts.delegations.result,
        delegatedValidatorList: state.stake.delegatedValidators.list,
    };
};

export default connect(stateToProps)(Table);