import { Component, OnInit, Input } from '@angular/core';
import { MasterDataService } from 'src/app/_services';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

  @Input() bgClass!: string;
  @Input() icon!: string;
  @Input() count!: number;
  @Input() label!: string;
  @Input() data!: number;
  gridMaster:any={};
  griddata:any=[];

  ddlPeriodval="";
  ddlyearVal="";  
  rdFxVal=""
  rdCurval:number=1000; 

  minpriod=1;
  maxperiod=12;
  curminperiodid=1;
  curmax=6;

  gridloading:boolean=false;
 

  

  updateLoading()
  {
    setTimeout((r:any)=> {
      this.gridloading=false;
    },1500);
  }

  nextPeriod()
  {
    this.gridloading=true;
    if(this.curmax<this.maxperiod)
    {
      this.curminperiodid=this.curminperiodid+6+1;
      this.curmax=this.curminperiodid+6;
    }

    if(this.curmax>this.maxperiod)
    {
      this.curminperiodid=this.maxperiod-6+1;
      this.curmax=this.maxperiod;    
    }

    this.griddata = this.griddata.map((i:any) => {
       console.log('Next',i,this.minpriod,this.maxperiod,this.curminperiodid,this.curmax);
      if(i.PeriodType=='M' && i.PeriodID>=this.curminperiodid && i.PeriodID<=this.curmax )
      {
        console.log("next",'true',i);
          i.Show=true;
      } 
      else if(i.PeriodType=='M' )
      {
        console.log("next",'false',i);
        i.Show=false
      }
        return i;
      
   
});

    

    this,this.updateLoading()
  }

  prevPeriod()
  {
    this.gridloading=true;
    if(this.curminperiodid>this.minpriod)
    {
      this.curminperiodid=this.curminperiodid-6;
      this.curmax=this.curminperiodid+6-1;
    }

    if(this.curminperiodid<this.minpriod)
    {
      this.curminperiodid=this.minpriod;
      this.curmax=this.minpriod+6;
    }

    this.gridMaster.header =  this.gridMaster.header.map((i:any) => {
      console.log('prev',i,this.minpriod,this.maxperiod,this.curminperiodid,this.curmax);

      if(i.PeriodType=='M' && i.PeriodID>=this.curminperiodid && i.PeriodID<=this.curmax )
      {
          i.Show=true;
      } 
      else if(i.PeriodType=='M' )
      {
        i.Show=false
      }
      
      return i;
}); 

   this.updateLoading();
  }

   filtermonths(user: any) {
    return  user.Show;
  }

  getTableData(descid:string,periodid:number,prop:string)
  {
    var obj=this.griddata.find((f:any)=>f.DescID==descid)?.Data.find((r:any)=>r.PeriodID==periodid);
   
    if(obj && obj[prop])
    {   
       console.log(obj,obj[prop]);   
      return  obj[prop] ;
    }
    else 
    {
    return 0;
    }


  }
  
  constructor(private sessionservice: MasterDataService) {}

  ngOnInit() {

    this.bindData();
    this.updateLoading();
  }

  bindData() {
    this.sessionservice.getPandLgridmaster({ horzid: '0' }).subscribe(s => {
      this.gridMaster = s;
      if (this.gridMaster && this.gridMaster?.filtertype?.length > 0) {
        this.ddlPeriodval = this.gridMaster.filtertype.find((f: any) => f.isdefault == true)?.id || '';
      } 

      if (this.gridMaster) {
        //this.ddlPeriodval = this.gridMaster.filtertype.find((f: any) => f.isdefault == true)?.id || '';
       // this.ddlyearVal = this.gridMaster.year.find((f: any) => f.isdefault == true)?.id || '';
       // this.rdFxVal = this.gridMaster.fx.find((f: any) => f.isdefault == true)?.id || '';
       // this.rdCurval = this.gridMaster.dol.find((f: any) => f.isdefault == true)?.id || '';
      } 

    }); 
    this.sessionservice.getPandLGridData({ horzid: '0' }).subscribe(s => {
      this.griddata = s;
    });
    
  }
}
