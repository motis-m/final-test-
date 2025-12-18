// ===== 轮播图功能 =====
// 定义轮播图图片路径数组
var aas = [ // var声明变量（旧方式），现在建议用let或const
    "images/a1.jpg", // 数组元素1：第一张轮播图
    "images/a2.jpg", // 数组元素2：第二张轮播图
    "images/a3.jpg"  // 数组元素3：第三张轮播图
];

var aaIndex = 0; // 当前轮播图索引，初始值为0（第一张）
var aaImg = document.getElementById("aaImg"); // document.getElementById()通过id获取DOM元素

// 检查轮播图元素是否存在
if (aaImg) { // if条件判断：如果aaImg存在（不为null或undefined）
    // 设置初始轮播图
    aaImg.src = aas[0]; // 设置img元素的src属性为第一个图片路径
    
    // 设置定时器，每3秒切换一次轮播图
    setInterval(function () { // setInterval()定时器函数，每隔指定时间执行一次
        aaIndex = (aaIndex + 1) % aas.length; // %取模运算符，实现循环索引
        aaImg.src = aas[aaIndex]; // 更新图片源
    }, 3000); // 时间间隔：3000毫秒 = 3秒
}

// ===== 跳转商品详情页 =====
function goDetail(page) { // function声明函数，page是参数
    if (page) { // 如果page参数有值（不是null、undefined、空字符串等假值）
        window.location.href = page; // window.location.href改变当前页面的URL
    } else {
        window.location.href = 'detail-1.html'; // 默认跳转到detail-1.html
    }
}

// ===== 加入购物车功能 =====
function addToCart(productId, productName, price, imgUrl) {
    // 创建商品对象
    var product = { // {}对象字面量，创建JavaScript对象
        id: productId,      // 属性：商品ID
        name: productName,  // 属性：商品名称
        price: price,       // 属性：商品价格
        img: imgUrl,        // 属性：商品图片路径
        count: 1            // 属性：商品数量，默认为1
    };

    // 从本地存储获取购物车数据
    // localStorage.getItem()获取存储的数据，JSON.parse()将JSON字符串转换为JavaScript对象
    // || 逻辑或运算符，如果前面为假值则使用后面的空数组
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var exists = false; // 标记商品是否已存在于购物车中

    // 遍历购物车，检查商品是否已存在
    for (var i = 0; i < cart.length; i++) { // for循环遍历数组
        if (cart[i].id === product.id) { // ===严格相等运算符，比较值和类型
            cart[i].count++; // 如果存在，数量加1
            exists = true; // 标记为已存在
            break; // break语句跳出循环
        }
    }

    // 如果商品不存在于购物车，则添加
    if (!exists) { // !逻辑非运算符，取反
        cart.push(product); // push()方法向数组末尾添加元素
    }

    // 保存购物车数据到本地存储
    // JSON.stringify()将JavaScript对象转换为JSON字符串
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("商品已成功加入购物车！"); // alert()弹出对话框
    
    // 更新购物车数量显示
    updateCartCount(); // 调用updateCartCount函数
}

// ===== 显示购物车内容 =====
function showCart() {
    // 获取购物车DOM元素
    var cartList = document.getElementById("cartList"); // 购物车列表容器
    var totalDom = document.getElementById("total"); // 总价显示元素

    // 如果元素不存在，则直接返回（退出函数）
    if (!cartList || !totalDom) return; // return语句结束函数执行

    // 获取购物车数据
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var total = 0; // 总价初始值
    cartList.innerHTML = ""; // 清空购物车列表内容

    // 如果购物车为空，显示提示信息
    if (cart.length === 0) { // length属性获取数组长度
        cartList.innerHTML = '<p style="text-align:center;color:#999;">购物车目前为空</p>';
        totalDom.innerText = "0"; // innerText设置元素文本内容
        return; // 返回，不再执行后面的代码
    }

    // 遍历购物车商品，生成HTML
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i]; // 当前商品对象
        var itemTotal = item.price * item.count; // 单个商品总价 = 单价 × 数量
        total += itemTotal; // 累加到总价

        // 使用模板字符串创建HTML（反引号``）
        // ${}是模板字符串的插值语法，可以嵌入变量
        // +=运算符，追加内容而不是替换
        cartList.innerHTML += ` 
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-info">
                    <p class="cart-title">${item.name}</p>
                    <p class="cart-price">单价：￥${item.price}</p>
                    <div class="cart-count">
                        <button onclick="changeCount('${item.id}', -1)">-</button>
                        <span>${item.count}</span>
                        <button onclick="changeCount('${item.id}', 1)">+</button>
                        <button onclick="removeItem('${item.id}')" style="margin-left:15px;">删除</button>
                    </div>
                </div>
                <div class="cart-total">
                    ￥${itemTotal}
                </div>
            </div>
        `;
    }

    // 显示总价，保留两位小数
    totalDom.innerText = total.toFixed(2); // toFixed()方法保留指定位数的小数
}

// ===== 修改商品数量 =====
function changeCount(productId, delta) { // delta参数表示数量变化值（+1或-1）
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // 查找对应商品并修改数量
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].count += delta; // 修改数量
            
            // 确保数量不小于1
            if (cart[i].count < 1) {
                cart[i].count = 1; // 最小数量为1
            }
            
            break; // 找到商品后跳出循环
        }
    }
    
    // 保存修改后的数据
    localStorage.setItem("cart", JSON.stringify(cart));
    showCart(); // 重新显示购物车
    updateCartCount(); // 更新购物车数量显示
}

// ===== 删除购物车商品 =====
function removeItem(productId) {
    // confirm()显示确认对话框，返回true或false
    if (!confirm("确定要删除这个商品吗？")) return;
    
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var newCart = []; // 新购物车数组，用于存放删除后的商品
    
    // 过滤掉要删除的商品
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) { // !==严格不等于运算符
            newCart.push(cart[i]); // 保留不需要删除的商品
        }
    }
    
    // 保存新购物车数据
    localStorage.setItem("cart", JSON.stringify(newCart));
    showCart(); // 更新显示
    updateCartCount(); // 更新数量显示
}

// ===== 更新购物车数量显示 =====
function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    var totalCount = 0; // 商品总数量
    
    // 计算所有商品的总数量
    for (var i = 0; i < cart.length; i++) {
        totalCount += cart[i].count; // +=运算符，累加
    }
    
    // 获取购物车链接元素
    // document.querySelector()使用CSS选择器获取第一个匹配的元素
    var cartLink = document.querySelector('a[href="cart.html"]');
    
    // 如果找到购物车链接且数量大于0，则显示数量
    if (cartLink && totalCount > 0) {
        cartLink.innerHTML = `购物车(${totalCount})`; // 修改链接文本
    }
}

// ===== 结算功能 =====
function goPay() {
    var cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // 检查购物车是否为空
    if (cart.length === 0) {
        alert("购物车是空的，请先添加商品！");
        return; // 如果为空，直接返回
    }
    
    // 确认结算
    if (confirm("确认要结算吗？")) {
        window.location.href = "order.html"; // 跳转到订单页
    }
}


// ===== 搜索功能 =====
function searchProduct() {
    // 获取搜索输入框的值，并转换为小写以便不区分大小写匹配
    var searchInput = document.querySelector('.search-box input'); // 获取搜索框
    if (!searchInput) return; // 如果搜索框不存在，直接返回
    
    var keyword = searchInput.value.trim().toLowerCase(); // trim()去除首尾空格，toLowerCase()转为小写
    
    // 如果搜索关键词为空，显示提示
    if (keyword === '') {
        alert('请输入搜索关键词！');
        return;
    }
    
    // 定义商品搜索关键词映射表
    // 这是一个对象，键是搜索关键词，值是对应的商品详情页
    var productMap = {
        // 手机相关关键词
        '手机': 'detail-1.html',
        '智能手机': 'detail-1.html',
        'p1': 'detail-1.html',
        '1799': 'detail-1.html',
        
        // 服装相关关键词
        '服装': 'detail-2.html',
        '衣服': 'detail-2.html',
        '鞋': 'detail-2.html',
        '包': 'detail-2.html',
        'p2': 'detail-2.html',
        '1999': 'detail-2.html',
        
        // 电器相关关键词
        '电器': 'detail-3.html',
        '家电': 'detail-3.html',
        '家用电器': 'detail-3.html',
        'p3': 'detail-3.html',
        '2399': 'detail-3.html'
    };
    
    // 检查搜索关键词是否在映射表中
    var targetPage = null;
    
    // 遍历映射表中的所有关键词
    for (var key in productMap) {
        // includes()方法检查搜索关键词是否包含映射表中的关键词
        if (keyword.includes(key)) {
            targetPage = productMap[key]; // 找到匹配的页面
            break; // 找到第一个匹配就退出循环
        }
    }
    
    // 根据搜索结果进行处理
    if (targetPage) {
        // 找到匹配的商品，跳转到对应详情页
        window.location.href = targetPage;
    } else {
        // 没有找到匹配的商品，显示提示信息
        alert('未找到相关商品，请尝试其他关键词！\n\n可搜索关键词：手机、服装、电器、P1、P2、P3等');
        // 可选：清空搜索框
        searchInput.value = '';
        searchInput.focus(); // 让搜索框重新获得焦点
    }
}

// ===== 搜索按钮点击事件处理 =====
function setupSearchEvent() {
    // 获取所有搜索按钮
    var searchButtons = document.querySelectorAll('.search-box button');
    
    // 为每个搜索按钮添加点击事件
    searchButtons.forEach(function(button) {
        // 移除之前可能绑定的事件处理函数，避免重复绑定
        button.onclick = null;
        
        // 绑定新的点击事件
        button.onclick = function() {
            searchProduct(); // 点击时执行搜索函数
        };
    });
    
    // 为搜索输入框添加回车键搜索功能
    var searchInputs = document.querySelectorAll('.search-box input');
    searchInputs.forEach(function(input) {
        // 监听键盘keydown事件
        input.addEventListener('keydown', function(event) {
            // event.keyCode === 13 表示回车键，event.key === 'Enter' 是现代浏览器的写法
            if (event.keyCode === 13 || event.key === 'Enter') {
                searchProduct(); // 按回车键执行搜索
                event.preventDefault(); // 防止表单提交的默认行为
            }
        });
    });
}




// ===== 页面加载时执行 =====
// window.onload事件在页面完全加载后触发
window.onload = function () { // 匿名函数作为事件处理函数
    // 检查当前页面是否有购物车列表元素
    if (document.getElementById("cartList")) {
        showCart(); // 如果是购物车页面，显示购物车内容
    }
    
    // 无论哪个页面，都更新购物车数量显示
    updateCartCount();
};