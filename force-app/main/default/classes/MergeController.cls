

public class MergeController {
    @AuraEnabled(cacheable=true)
    // Method to process the list of BomDistiobj__c objects and generate a list of finalistobj__c objects
Public Static List<finalistobj__c> mergeDataController(List<BomDistiobj__c>Bomdisti)
{
      // Map to store the aggregated quantities of distinct disti part numbers
 Map<String,integer>disti=new Map<string,integer>();
         // List to store the final results
 List<finalistobj__c>finalList=new List<finalistobj__c>();
 
   // Loop through the Bomdisti list to aggregate quantities based on disti part numbers
 for(BomDistiobj__c d:Bomdisti)
 {
    //checking for disti's record ,if partNumber is not Null => distis's existence
     if(d.disti_pn__c !=null)
     {
         // if PartNumber already exist in disti's map then we have do aggragation
         if(disti.containsKey(d.disti_pn__c))
         {
             integer t=(integer)disti.get(d.disti_pn__c);
             //aggregation
             t+=(integer)d.disti_qty__c;
             disti.put(d.disti_pn__c,t);
         }
         else
         {
             disti.put(d.disti_pn__c,(integer)d.disti_qty__c);
         }
     }
 }
 
 
 
 //implementing code acc. to problem statement
 
 for(BomDistiobj__c b:Bomdisti)
 {
        string BoM_PN=b.Bom_pn__c;
     // checking bom's record ,if bom PartNumber is not Null then =>Bom's record exist
if(BoM_PN!=null){
     Integer BoM_Qty=(Integer)b.bom_qty__c;
 //checking Bom's record exist or not in disti's map
     if(disti.containsKey(BoM_PN))
     {
         // exists
        Integer Disti_Qty = disti.get(BoM_PN);
       // condition 1:-both quntities are equal 
         if(BoM_Qty==Disti_Qty)
      {
          finalistobj__c item=new finalistobj__c();
          item.bomPartnumber__c=BoM_PN;
            item.bomqty__c=BoM_Qty;
           item.distiPartnumber__c=BoM_PN;
          item.distiqty__c=Disti_Qty;
finalList.add(item);
          // no furture spliting
          disti.remove(BoM_PN);

      }
                   // condition 2:- BoM_Qty>Disti_Qty

      else if(BoM_Qty>Disti_Qty)
      {
          finalistobj__c item=new finalistobj__c();
          item.bomPartnumber__c=BoM_PN;
            item.bomqty__c=BoM_Qty;
           item.distiPartnumber__c=BoM_PN;
          item.distiqty__c=Disti_Qty;
          item.errorFlag__c=true;
finalList.add(item);
          // no furture spliting
          disti.remove(BoM_PN);

      }
         else
         {
             finalistobj__c item=new finalistobj__c();
          item.bomPartnumber__c=BoM_PN;
               item.bomqty__c=BoM_Qty;
          item.distiPartnumber__c=BoM_PN;
          item.distiqty__c=BoM_Qty;
          //item.errorFlag__c=false;
finalList.add(item);
             //spliting
             integer remaining=Disti_Qty-BoM_Qty;
             //rewriting of distis's record 
             disti.put(BoM_PN,remaining);
             
         }
         
     }
     // if Bom PartNumber doesn't exist in disti's map
     else
     {
         finalistobj__c item=new finalistobj__c();
         // Bom's corresponding fields will be Null;
          item.bomPartnumber__c=BoM_PN;
              item.bomqty__c=BoM_Qty;
          item.distiPartnumber__c=null;
          item.distiqty__c=null;
          item.errorFlag__c=true;
finalList.add(item);

     }
}
 }
 
 // Bom's items corresponding to remaining disti's list are not exists
 if(!disti.isEmpty())
 {
     for (String key : disti.keySet())
     {
        
         finalistobj__c item=new finalistobj__c();
          item.bomPartnumber__c=null;
                 item.bomqty__c=null;
          item.distiPartnumber__c=key;
          item.distiqty__c=disti.get(key);
          item.errorFlag__c=true;
finalList.add(item);
    }
     
     
 }
 // Final combined list 
 return finalList ;
}
}