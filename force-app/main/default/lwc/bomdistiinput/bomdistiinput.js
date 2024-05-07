import { LightningElement, track } from 'lwc';
import saveRecord from '@salesforce/apex/BomDistiController.saveRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class BomDistiInput extends LightningElement {
    @track partNumber = '';
    @track quantity ;
    @track distiPartNumber = '';
    @track distiQuantity ;
    @track recordType = '';

    get typeOptions() {
        return [
            { label: 'BoM', value: 'BoM' },
            { label: 'Disti', value: 'Disti' }
        ];
    }

    get isBoM() {
        return this.recordType === 'BoM';
    }

    get isDisti() {
        return this.recordType === 'Disti';
    }

    handlePartNumberChange(event) {
        this.partNumber = event.target.value;
    }

    handleQuantityChange(event) {
        this.quantity = event.target.value;
    }

    handleDistiPartNumberChange(event) {
        this.distiPartNumber = event.target.value;
    }

    handleDistiQuantityChange(event) {
        this.distiQuantity = event.target.value;
    }

    handleTypeChange(event) {
        this.recordType = event.target.value;
    }

    saveRecord() {
        const params = {
            bomPn: this.isBoM ? this.partNumber : null,
            bomQty: this.isBoM ? this.quantity : null,
            distiPn: this.isDisti ? this.distiPartNumber : null,
            distiQty: this.isDisti ? this.distiQuantity : null,
            recordType:this.recordType
        };

        saveRecord(params)
            .then(() => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Success',
                    message: 'Record saved successfully',
                    variant: 'success'
                }));
                this.clearForm();
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: error.body.message || 'Unknown error',
                    variant: 'error'
                }));
            });
    }

    clearForm() {
        this.partNumber = '';
        this.quantity = 0;
        this.distiPartNumber = '';
        this.distiQuantity = 0;
        this.recordType = '';
    }
}