import React from 'react';
import { HorizontalLine } from 'assets/images';
import { 
    KeyboardArrowDown, 
    KeyboardArrowUp, 
} from '@material-ui/icons';
import {Input} from '@material-ui/core'
import ConditionComponent from '../ConditionButton/ConditionComponent';
import NoteComponent from '../NoteButton/NoteButton';
import PriorityComponent from '../PriorityComponent/PriorityComponent';
import {CONDITIONCODE} from 'constants/conditionCode';
import {renderIcon} from 'utils/checksheet.helper'


export default class CollapseList extends React.PureComponent{
    constructor(props){
        super(props);
        this.state={
            isExpanded:false,
        }
    }
    onDataChange = (newChecksheet) => {
        const {CheckSheetValues} = this.props
        const newData = this.props.ZoneCheckSheets.map((zone) => {
            if (zone.ZoneDesc !== CheckSheetValues.ZoneDesc)
                return zone
            let newArea = [];
            zone.AreaCheckSheets.map((area) => {
                // New areaChecksheets properties
                if (area.Area !== CheckSheetValues.AreaDesc) {
                    newArea = [...newArea, area];
                    return newArea
                }
                let newValue = [];
                // New CheckSheetValues properties
                area.CheckSheetValues.map((value) => {
                    if (value.Id !== CheckSheetValues.Id) {
                        newValue = [...newValue, value]
                        return newValue;
                    }
                    newValue = [...newValue, newChecksheet];
                    return newValue
                });
                newArea = [...newArea,{...area,CheckSheetValues:newValue}]
                return newArea;
            });
            return {...zone,AreaCheckSheets:newArea}
        })
          this.props.updateFormValue(newData);
    }
    
    handleChangeCondition = (field) => {
        this.onDataChange({...this.props.CheckSheetValues, MCondition:field})
    }
    handleChangeComment= (event) => {
        this.onDataChange({...this.props.CheckSheetValues, Comment:event.target.value})
    }
    _renderConditionButton = () => {
        const {CheckSheetValues} = this.props;
        return(
            <div className='condition-detail-container'>
                <div className='condition-row'>
                    <ConditionComponent
                        {...this.props}
                        onChangeCondition={this.handleChangeCondition}
                        MCondition={CheckSheetValues.MCondition}
                        Measurement={CheckSheetValues.Measurement}
                    />
                    { 
                        CheckSheetValues.MCondition.Code === CONDITIONCODE.BAD && <NoteComponent/>
                    }
                    {
                        CheckSheetValues.MCondition.Code === CONDITIONCODE.BAD && <PriorityComponent/>
                    }
                </div>
                    {
                        CheckSheetValues.MCondition.Code === CONDITIONCODE.BAD &&
                    <div className='condition-row'>
                        <div className='comment-container'>
                    {/* Translate text */}
                        <div className='btn-label'>Comment</div>
                        <Input className='comment-input-form' value={CheckSheetValues.Comment || ''} onChange={this.handleChangeComment} />
                        </div>
                        <div className='backlog-container'>
                        <div className='btn-label'>Backlog</div>
                        <div className={CheckSheetValues.BacklogId ? 'btn-backlog-problems' : 'btn-backlog-null'}>
                            {CheckSheetValues.BacklogId ? 'Yes' : '+'}
                        </div>
                        </div>
                    </div>
                    }
            </div>
        )
    }
    _renderContent = () => {
        const {CheckSheetValues} = this.props;
        const ConditionCode = CheckSheetValues.MCondition.Code;
        const Measurement = CheckSheetValues.Measurement;
        return(
            <>
            <div className='checklist-item-header-container' onClick={() => this.setState({isExpanded:!this.state.isExpanded})}>
                <p className='title'>{`${CheckSheetValues.Sequence}. ${CheckSheetValues.ItemDesc}`}</p>
                <img className='horizontal-line' src={HorizontalLine} alt='horizontal line'/>
                <div className='icons'>
                    <img 
                        className='completed-icon' 
                        // insert condition icon on src
                        src={renderIcon(ConditionCode,Measurement)}
                        alt='condition icon'
                    />
                    {
                        this.state.isExpanded ? <KeyboardArrowUp className='arrow-icon'/>:<KeyboardArrowDown className='arrow-icon'/>
                    }
                    
                </div>
            </div>
            {
                this.state.isExpanded &&
                this._renderConditionButton()
            }
            </>
        )
    }
    render(){
        return(
            <div className='checklist-item-container'>
                {this._renderContent()}
            </div>
        )
    }
}