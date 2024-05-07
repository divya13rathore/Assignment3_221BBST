import { LightningElement, track, wire } from 'lwc';
import getRec from '@salesforce/apex/BomDistiController1.getRec';

export default class BomDistiDisplay extends LightningElement {
    @track bomRecords = [];
    @track distiRecords = [];
    @track filter = '';

    @wire(getRec)
    wiredRecords({ error, data }) {
        if (data) {
            this.bomRecords = this.processRecords(data.filter(record => record.type__c == 'BoM'));
            this.distiRecords =this.processRecords( data.filter(record => record.type__c == 'Disti'));
        } else {
            console.error('Error loading records', error);
        }
    }

    handleFilterChange(event) {
        this.filter = event.detail.value;
    }

    get isDisti() {
        return this.filter === 'Disti';
    }

    get isBoM() {
        return this.filter === 'BoM';
    }

    get isAll() {
        return !this.filter; // Return true if filter is empty
    }

    get typeOptions() {
        return [
            { label: 'All', value: '' },
            { label: 'BoM', value: 'BoM' },
            { label: 'Disti', value: 'Disti' }
        ];
    }
    processRecords(records) {
        return records.map(record => ({
            id: record.Id, // assuming each record has an Id field
            partNumber: record.Bom_pn__c ? record.Bom_pn__c : record.disti_pn__c,
            quantity: record.Bom_pn__c ? record.bom_qty__c : record.disti_qty__c
        }));
    }

    get columns() {
        return [
            { label: 'Part Number', fieldName: 'partNumber', type: 'text' },
            { label: 'Quantity', fieldName: 'quantity', type: 'number' }
        ];
    }
}
