import React from 'react';
import { Input } from '@material-ui/core';
import {Delete} from 'assets/icons';
import './Additional.scss';

export default class Additional extends React.PureComponent{
    
    // Handle Additional Fluid when user adding fluid.
    _handleAddFluid = () => {
        let newFluid = [];
        const {
            workOrderId,
            zoneDesc,
            additionalFluids
        } = this.props;
        const additional = {
            WoId:workOrderId,
            Name:'',
            Quantity:0.5,
            UOM:'L',
            ZoneDesc:zoneDesc,
        };
        if(additionalFluids.length < 1 ) newFluid=[additional];
        else {
            additionalFluids.map((fluid) => {
                newFluid=[...newFluid,fluid];
                return newFluid;
            });
            newFluid.push(additional)
        }
        const newAdditionalFluid = this.props.ZoneCheckSheets.map((field) => {
            if(field.ZoneDesc === zoneDesc) return {...field,AdditionalFluids:newFluid}
            return field;
        })
        this.props.updatePiForm(newAdditionalFluid)
    }
    _handleChangeFluid = (event,Id,key) => {
        const {ZoneCheckSheets} = this.props;
        const newData = ZoneCheckSheets.map((field) => {
            const newFluid = key === 'delete' ? field.AdditionalFluids.filter(((fluid) => fluid.Id !== Id)) : field.AdditionalFluids.map((fluid) => {
                if (fluid.Id === Id) {
                    if ( key === 'plus') return {...fluid, Quantity:fluid.Quantity + 0.5};
                    if ( key === 'min' && fluid.Quantity > 0.5 ) return {...fluid, Quantity:fluid.Quantity - 0.5};
                    if ( key === 'change') return {...fluid, Name: event.target.value};
                    return {...fluid};
                }
                return fluid;
            })
            return {...field, AdditionalFluids:newFluid}
        })
        this.props.updatePiForm(newData)
    }
    // Render Component Additional Fluid
    _renderContent = () => {
        const {additionalFluids} = this.props;
        return(
            <>
            <div className='addition-title'>
                Addition
            </div>
               {
                additionalFluids.map((field,index) => (
                <div className='addition-detail'>
                    <div className='fluid-description'>
                        <label className='fluid-label'>{`ADDITIONAL OF FLUID ${index + 1}`}</label>
                        <Input className='additional-input' value={field.Name} onChange={(event) => this._handleChangeFluid(event,field.Id,'change')} />
                    </div>
                    <div className='fluid-quantity'>
                        <label className='fluid-label'>{'QUANTITY'}</label>
                        <div className='fluid-quantity-container'>
                            <div className='fluid-quantity-card-btn' onClick={(event) => this._handleChangeFluid(event,field.Id,'min')}>{'-'}</div>
                            <div className='fluid-quantity-card'>{field.Quantity}</div>
                            <div className='fluid-quantity-card-btn' onClick={(event) => this._handleChangeFluid(event,field.Id,'plus')}>{'+'}</div>
                            <img className='fluid-delete' alt='delete' src={Delete} onClick={(event) => this._handleChangeFluid(event,field.Id,'delete')} />
                        </div>
                    </div>
                </div>
                ))
                }
                <div className='btn-addition' onClick={this._handleAddFluid}>
                    {'+ Other Addition'}
                </div>
            </>
            
        )
    }
    render(){
        return(
            <div className='addition-container'>
                {/* Mapping data fluid */}
                {this._renderContent()}
            </div>
        )
    }
}