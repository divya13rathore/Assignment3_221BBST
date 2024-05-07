public with sharing class BomDistiController1 {
    @AuraEnabled(cacheable=true)
    public static List<BomDistiobj__c> getRec() {
        List<BomDistiobj__c> records = [SELECT Id, Bom_pn__c, bom_qty__c, disti_pn__c, disti_qty__c, type__c FROM BomDistiobj__c where (Bom_pn__c!='null' or disti_pn__c!='null') ];
        System.debug('Retrieved records: ' + records);
        return records;
    }
}
