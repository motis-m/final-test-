// ===== 轮播图功能 =====
var banners = [
    "images/a1.jpg", // 第一张轮播图
    "images/a2.jpg", // 第二张轮播图
    "images/a3.jpg"  // 第三张轮播图
];

var bannerIndex = 0; // 当前轮播图索引
var bannerImg = document.getElementById("bannerImg"); // 获取轮播图DOM元素

if (bannerImg) {
    // 设置初始轮播图
    bannerImg.src = banners[0];
    
    // 每3秒切换一次轮播图
    setInterval(function () {
        bannerIndex = (bannerIndex + 1) % banners.length; // 循环切换
        bannerImg.src = banners[bannerIndex]; // 更新图片源
    }, 3000);
}

// ===== 跳转商品详情页 =====
function goDetail(page) {
    if (page) {
        window.location.href = page; // 跳转到指定页面
    } else {
        window.location.href = 'detail-1.html'; // 默认跳转
    }
}

// ===== 加入购物车功能 =====
function addToCart(productId, productName, price, imgUrl) {
    var product = {
        id: productId,      // 商品ID
        name: productName,  // 商品名称
        price: price,       // 商品价格
        img: imgUrl,        // 商品图片
        count: 1            // 商品数量，默认为1
    };

    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    var exists = false; // 标记商品是否已存在

    // 检查商品是否已在购物车中
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
            cart[i].count++; // 数量加1
            exists = true; // 标记为已存在
            break;
        }
    }

    // 如果商品不存在，添加到购物车
    if (!exists) {
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart)); // 保存购物车数据
    alert("商品已成功加入购物车！");
    
    updateCartCount(); // 更新购物车数量显示
}

// ===== 显示购物车内容 =====
function showCart() {
    var cartList = document.getElementById("cartList"); // 购物车列表容器
    var totalDom = document.getElementById("total"); // 总价显示元素

    if (!cartList || !totalDom) return; // 如果元素不存在则返回

    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    var total = 0; // 总价初始值
    cartList.innerHTML = ""; // 清空购物车列表

    // 如果购物车为空，显示提示信息
    if (cart.length === 0) {
        cartList.innerHTML = '<p style="text-align:center;color:#999;">购物车空空如也，快去挑选商品吧！</p>';
        totalDom.innerText = "0";
        return;
    }

    // 遍历购物车商品，生成HTML
    for (var i = 0; i < cart.length; i++) {
        var item = cart[i];
        var itemTotal = item.price * item.count; // 单个商品总价
        total += itemTotal; // 累加总价

        cartList.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}"> <!-- 商品图片 -->
                <div class="cart-info">
                    <p class="cart-title">${item.name}</p> <!-- 商品名称 -->
                    <p class="cart-price">单价：￥${item.price}</p> <!-- 商品单价 -->
                    <div class="cart-count">
                        <button onclick="changeCount('${item.id}', -1)">-</button> <!-- 减少数量 -->
                        <span>${item.count}</span> <!-- 当前数量 -->
                        <button onclick="changeCount('${item.id}', 1)">+</button> <!-- 增加数量 -->
                        <button onclick="removeItem('${item.id}')" style="margin-left:15px;">删除</button> <!-- 删除商品 -->
                    </div>
                </div>
                <div class="cart-total">
                    ￥${itemTotal} <!-- 商品小计 -->
                </div>
            </div>
        `;
    }

    totalDom.innerText = total.toFixed(2); // 显示总价，保留两位小数
}

// ===== 修改商品数量 =====
function changeCount(productId, delta) {
    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    
    // 查找对应商品
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].count += delta; // 修改数量
            
            // 确保数量不小于1
            if (cart[i].count < 1) {
                cart[i].count = 1;
            }
            
            break;
        }
    }
    
    localStorage.setItem("cart", JSON.stringify(cart)); // 保存数据
    showCart(); // 更新购物车显示
    updateCartCount(); // 更新购物车数量
}

// ===== 删除购物车商品 =====
function removeItem(productId) {
    if (!confirm("确定要删除这个商品吗？")) return; // 确认删除
    
    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    var newCart = []; // 新购物车数组
    
    // 过滤掉要删除的商品
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]); // 保留其他商品
        }
    }
    
    localStorage.setItem("cart", JSON.stringify(newCart)); // 保存新购物车
    showCart(); // 更新显示
    updateCartCount(); // 更新数量
}

// ===== 更新购物车数量显示 =====
function updateCartCount() {
    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    var totalCount = 0; // 总数量
    
    // 计算商品总数量
    for (var i = 0; i < cart.length; i++) {
        totalCount += cart[i].count;
    }
    
    var cartLink = document.querySelector('a[href="cart.html"]'); // 获取购物车链接
    if (cartLink && totalCount > 0) {
        cartLink.innerHTML = `购物车(${totalCount})`; // 显示数量
    }
}

// ===== 结算功能 =====
function goPay() {
    var cart = JSON.parse(localStorage.getItem("cart")) || []; // 获取购物车数据
    
    // 检查购物车是否为空
    if (cart.length === 0) {
        alert("购物车是空的，请先添加商品！");
        return;
    }
    
    // 确认结算
    if (confirm("确认要结算吗？")) {
        window.location.href = "order.html"; // 跳转到订单页
    }
}

// ===== 页面加载时执行 =====
window.onload = function () {
    // 如果是购物车页面，显示购物车内容
    if (document.getElementById("cartList")) {
        showCart();
    }
    
    // 更新购物车数量显示
    updateCartCount();
};