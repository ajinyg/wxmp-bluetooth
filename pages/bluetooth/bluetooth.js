let blueTooth = getApp().__app_blue;
Page({
  data: {
    buffs_gbk : "ISAwIDIwMCAyMDAgNzQwIDEKUEFHRS1XSURUSCA3MDAKVEVYVCAwIDYgMCAwIMfzusO79aGkxeTLzbWlClRFWFQgMTAgMCAzODUgMTAgMjAtMDctMTUgMjA6NDkKVEVYVCAxMCAwIDEwIDg1IKG+tqm1pbrFob8zClRFWFQgMTAgMCAxMCAxMjUgob7PwrWlyrG85KG/NzAtMDEtMDEgMDg6MzIKVEVYVCAxMCAwIDEwIDE2NSChvtKqx/PLzbTvyrG85KG/MjAtMDctMDkgMTc6NTEKVEVYVCAxMCAwIDEwIDIwMCChvsihu/W12Na3ob/T/bfG1LC2q8DvMTi6xcKlClRFWFQgMTAgMCAxMCAyNDAgMrWl1KoyMDEKTElORSAxMCA3MCAzNTUgNzAgMgpCIFFSIDM4MCA0MCBNIDIgVSA2Ck1BLGh0dHBzOi8vcXIuYWxpcGF5LmNvbS9zNXgxOTY3NG5yd2N4OGFibHhoeGw0OQpFTkRRUgpURVhUIDcgMCAxMCAyNzAg4/nRxcmrIE1BQyCw9LD0zMe0vdPUICMxMDYgTk8gSU5URVJSVU8KVEVYVCA3IDAgMTAgMzEwIFRJT04gs7XA5dfTyasKVEVYVCA3IDAgMTAgMzgwIMX6tM66xaO6MQpURVhUIDcgMCAzODUgMzgwIDK8/gpURVhUIDcgMCAxMCA0MjAgxfq0zrrFo7oxClRFWFQgNyAwIDM4NSA0MjAgMrz+CkxJTkUgMCA0NjAgNzAwIDQ2MCAyClRFWFQgMTAgMCAxMCA0ODAgubI6Nbz+ClRFWFQgMTAgMCAyMDAgNDgwILWlvNs6MNSqClRFWFQgMTAgMCAzODAgNDgwINfcvNs6MNSqCkxJTkUgMCA1MjAgNzAwIDUyMCAyClRFWFQgMCAzIDMwIDU0MCC607GxINXFvNK/2iDVxbGxINP9t8bUsLarwO8xOLrFwqUytaXUqgpURVhUIDAgMyAzMCA1ODAgMjAxCkxJTkUgMCA2ODAgMTAwIDY4MCAyCkxJTkUgNDUwIDY4MCA3MDAgNjgwIDIKVEVYVCAxMCAwIDEyMCA2NzAgx/O6w7v1v823/rXnu7A6MTg2MDM5ODI1OTcKRk9STQpQUklOVAo="
  },
  onLoad(){
    this.refBlueTooth = this.selectComponent('#blueTooth');
    //更新蓝牙
    this.updateBlueTooth();
  },
  updateBlueTooth(){
    return this.setData({blueTooth:blueTooth});
  },
  show(){
    this.updateBlueTooth();
    this.refBlueTooth.show();
  },
  onBlueToothHide(){
    this.updateBlueTooth();
  },
  onPrint(){
    const { buffs_gbk } = this.data;
    if(!this.refBlueTooth.showConnected()){
      return this.refBlueTooth.show();
    }
    this.refBlueTooth.onPrint({
        buffs_gbk:buffs_gbk,
        loadingStatus:'currentSign'
    });
  },
})
