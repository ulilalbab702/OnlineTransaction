import React from 'react';
import ConditionGroup from '../ConditionGroup/ConditionGroup';
import './ConditionComponent.scss'
import { renderProperties } from 'utils/checksheet.helper';

export default class ConditionComponent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowCondition: false,
            isAnchorEl: false,
            anchorEl: null
        }
    }
    handleClick = (event) => {
        this.setState({
            isShowCondition: true,
            anchorEl: event.currentTarget
        })
    }
    handleSelectCondition = (field) => {
        this.setState({
            isShowCondition: false
        })
        this.props.onChangeCondition(field)
    }
    render() {
        const { MCondition, Measurement } = this.props;
        const conditionCode = MCondition.Code;
        const conditionDesc = MCondition.Desc;
        return (
            <div className='popover-container'>
                <div className='btn-label'>Condition</div>
                <div className='condition-popover'>
                    <div className={renderProperties(Measurement, conditionCode, conditionDesc).name} onClick={this.handleClick}>
                        <img className='condition-icon' alt='condition icon' src={renderProperties(Measurement, conditionCode, conditionDesc).icon} />
                        <div className='label-level'>{renderProperties(Measurement, conditionCode, conditionDesc).desc}</div>
                    </div>
                </div>
                <ConditionGroup
                    {...this.props}
                    onClick={this.handleSelectCondition}
                    isOpen={this.state.isShowCondition}
                    anchorEl={this.state.anchorEl}
                />
            </div>
        )
    }
}