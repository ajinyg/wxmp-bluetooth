import { BlueTooth } from './index';
let app = getApp();
let canUseBlueTooth = true;//控制当前选择的设备
let blueTooth = new BlueTooth();
Component({
  data: {
      devices:{}, //当前发现的设备列表
      connected_uuid:'', // 当前连接的设备UUID
      connected_name:''//当前连接设备  name
  },
  attached(){
    this.initBLE(); 
  }, 
  methods: {
    initBLE(){
      this.checkGlobalBlueToothAdapter({
        devices:app.__app_blue.devices,
        connected_uuid:app.__app_blue.connected_uuid,
        connected_name:app.__app_blue.connected_name,
        success: res => {
          this.openBlueToothAdapter();
        }
      });
    },
    openBlueToothAdapter() {
      //监听蓝牙适配器状态变化
      blueTooth.addEventListBle({
        success: res => {
          this.updateAdapterStatus(res.discovering);
        }
      });
      //初始化蓝牙适配器
      blueTooth.initBlueTooth({
        success: res => {
          this.updateAdapterStatus(res.discovering);
        }
      });
      //添加新发现的蓝牙设备到设备列表中 
      blueTooth.blueFound({
        success: res => {
          this.updateAdDevices(res.data);
        }
      });
    },

    //连接设备
    connectTo(e){
      let deviceId = e.currentTarget.dataset.id;
      let devices = app.__app_blue.devices;
      //检查当前连接设备
      const checkBlueToothStatus = function (){
        for(let k in devices){
          if( devices[k].is_connected ){
            return true;
          }
        }
        return false;
      }
      setTimeout(()=>{canUseBlueTooth = true},3000)
      if (!canUseBlueTooth) {
        return console.log('小伙子，点的有点快了啊！！！');
      }

      if(checkBlueToothStatus()){
        return console.log('当前有连接设备！！！');
      }
      canUseBlueTooth =  false;
      devices[deviceId].is_showLoading = true;
      this.setData({
        devices:devices
      })

      //连接蓝牙设备 
      blueTooth.createBlueTooth({
        deviceId:deviceId,
        devices:devices,
        success: res => {
          console.log(res , `blueTooth检查 。。`)
          //检查
          this.checkGlobalBlueToothAdapter({
            devices:devices,
            connected_uuid:deviceId,
            connected_name:devices[deviceId].name,
            success:()=>{
              canUseBlueTooth = true
              this.hide();
            }
          })
        }
      });
    },

    //断开蓝牙
    disconnectDevice(e) {
      var deviceId = e.currentTarget.dataset.id;
      var devices = app.__app_blue.devices;
      blueTooth.disconnectDevice({
        deviceId:deviceId,
        devices:devices,
        success: res => {
          this.checkGlobalBlueToothAdapter({
            devices:devices,
            connected_uuid:'',
            connected_name:'',
            success:()=>{}
          })
        }
      });
    },

    //打印
    onPrint(options) {
      console.log(options,`onPrint`)
      if ( !(options && options.buffs_gbk) ) {
        return wx.showModal({
          content: '打印出错，请立即联系管理员',
          showCancel:false
        })
      }

      let { buffs_gbk } = options || {};
      let _globalBlueTooth = app.__app_blue;
      let { connected_uuid,devices } =  _globalBlueTooth;
      let device = devices[connected_uuid];
      let service,characteristic;

      // 找到一个可写特征执行打印
      OUTLOOP:
      for (var k1 in device.services) {
          service = device.services[k1]

        for (var k2 in service.characteristics) {
            characteristic = service.characteristics[k2];

          if (characteristic.properties.write) {

              blueTooth.onPrint({
                deviceId          : connected_uuid,
                serviceId         : service.uuid,
                characteristicsId : characteristic.uuid,
                buffs             : options.buffs_gbk,
                loadingStatus     : options.loadingStatus
              });

            break OUTLOOP
          }
        }
      }
    },

    //检查global设备状态
    checkGlobalBlueToothAdapter({devices,connected_uuid,connected_name,success}){

      const globaBlueToothAdapter = function (devices,connected_uuid,connected_name) {
        app.__app_blue.devices = devices;
        app.__app_blue.connected_uuid = connected_uuid;
        app.__app_blue.connected_name = connected_name;
      }

      //更新本地
      return this.setData({
        devices:devices,
        connected_uuid:connected_uuid,
        connected_name:connected_name
      },function(){
        // global Update
        globaBlueToothAdapter(devices,connected_uuid,connected_name);
        success & success();
      })
    },
    //发现的蓝牙设备到设备列表中 
    updateAdDevices(devices){
      this.setData({
        devices:devices,
        noneBle:true
      })
    },

    //绑定状态变更通知事件. 用于修改适配器状态
    updateAdapterStatus(discovering) {
      this.setData({
        adapter_discovering: discovering,
      })
    },

    //如果没有连接蓝牙， 去连接
    showConnected(e){
      return app.__app_blue.connected_uuid
    },

    onSendHide(){
      this.triggerEvent('onBlueToothHide');
    },

    refresh(){
      blueTooth.refresh();
    },

    hideMessageModel(){
      this.selectComponent('#messageModel').hide();
    },

    showMessageModel(){
      this.selectComponent('#messageModel').show();
    },

    hide(){
      this.hideMessageModel();
    },

    show(){
      this.refresh();
      this.showMessageModel();
    }
  }
});