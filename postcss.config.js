module.exports = {
    // 配置要使用的PostCSS插件
    plugins: {
        // 配置使用postcss-pxtorem插件
        // 作用：px转化为rem
        'postcss-pxtorem': {
            // 使用了lib-flexible的rem适配方案：把一行分为10份，1rem就等于其中的一份，rootValue的值就是1rem代表的px值。
            // 设计稿的宽度是750px 十分之一就是75px  1rem就是75px 按理说rootValue应该是75px  ，但是Vant建议设置rootValue为37.5px  因为Vant是基于行宽度375px设计的  在画图时  需要宽度为750px的设计稿所有尺寸除以2   太麻烦了 有没有更好解决方案？
            // 如果是Vant的样式，就按照37.5转换
            // 如果是我们自己的样式，就按照75转换
            // 通过查阅文档，我们发现rootValue支持两种类型：1）数字：固定的数值；2）函数：可以动态处理返回；
            // postcss-pxtorem处理每个CSS文件的时候都会来调用rootValue()函数，它会把被处理的css文件相关的信息通过参数传递给该函数
            rootValue({ file }) {
                console.log('file是被处理的css文件的路径', file)
                return file.indexOf('vant') !== -1 ? '37.5' : '75'
            },
            // 配置要转换的CSS属性
            // *表示所有
            propList: ['*']
        },
    },
};
