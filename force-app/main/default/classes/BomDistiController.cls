public with sharing class BomDistiController {
    // Method to save a new BoM/Disti record
    @AuraEnabled
    public static BomDistiobj__c saveRecord(String bomPn, Decimal bomQty, String distiPn, Decimal distiQty,String recordType) {
        try {
            BomDistiobj__c newRecord = new BomDistiobj__c();

            
                newRecord.Bom_pn__c = bomPn;
                newRecord.bom_qty__c = bomQty;
                newRecord.disti_pn__c = distiPn;
                newRecord.disti_qty__c = distiQty;
                newRecord.type__c = recordType;

             insert newRecord;
             return newRecord;
                    }
         catch (Exception e) {
            throw new AuraHandledException('Error saving record: ' + e.getMessage());
        }
    }
  



}
