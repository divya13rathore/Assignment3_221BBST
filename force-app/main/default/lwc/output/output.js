import { LightningElement, track, wire } from 'lwc';
import getRec from '@salesforce/apex/BomDistiController1.getRec';
import mergeDataController from '@salesforce/apex/MergeController.mergeDataController';

export default class Output extends LightningElement {
    @track recordsData; // Stores the records fetched from getRec
    @track mergedData; // Stores the merged data results
    @track isLoading = false;
    @track error;

    // Wire adapter to fetch data upon component load
    @wire(getRec)
    wiredRecords({ error, data }) {
        if (data) {
            this.recordsData = data; // Store the records data for use in merging
        } else if (error) {
            console.error('Error fetching records:', error);
            this.error = 'Failed to load records.';
        }
    }

    // Event handler for button click to initiate merge process
    handleMerge() {
        if (this.recordsData) {
            this.isLoading = true;
            mergeDataController({ Bomdisti: this.recordsData })
                .then(result => {
                    this.mergedData = result;
                    this.isLoading = false;
                })
                .catch(error => {
                    console.error('Error merging data:', error);
                    this.error = 'Failed to merge data.';
                    this.isLoading = false;
                });
        } else {
            this.error = 'No data available to merge.';
            console.log('No records to merge.');
        }
    }

    get columns() {
        return [
            { label: 'BoM Part Number', fieldName: 'bomPartnumber__c', type: 'text' },
            { label: 'BoM Quantity', fieldName: 'bomqty__c', type: 'number' },
            { label: 'Disti Part Number', fieldName: 'distiPartnumber__c', type: 'text' },
            { label: 'Disti Quantity', fieldName: 'distiqty__c', type: 'number' },
            { label: 'Error Flag', fieldName: 'errorFlag__c', type: 'boolean' }

            
        ];
    }

    // Optional: Helper to render the button conditionally based on data availability
    get isMergeButtonDisabled() {
        return !this.recordsData;
    }
}
