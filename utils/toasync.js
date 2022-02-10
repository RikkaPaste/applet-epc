export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export const showModal=()=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: '是否需要删除该商品',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
                resolve(result.confirm);
            },
            fail: (err) => {
                reject(err);
            }
        });
          
    });
}

export const showToast=(content)=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: content,
            icon:"none",//success,loading
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
}

export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {reject(err);}
        });
    });
}

export const uploadFile=(param)=>{
    return new Promise((resolve,reject)=>{
        wx.uploadFile({
            url: param.url,//远程服务器url
            filePath: param.filePath,//本地图片路径
            name: param.name,//image,表单的name属性
            formData: param.formData,
            success: (result) => {
              console.log(result);
              resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
          });
    });
}