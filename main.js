// 功德点击
const woodenFish = document.getElementById('woodenFish');
const clickCount = document.getElementById('clickCount');
let count = 0;

function createMeritText() {
    const text = document.createElement('div');
    text.className = 'merit-text';
    text.textContent = '+1';
    text.style.left = `${Math.random() * 40 + 30}%`;
    woodenFish.appendChild(text);
    
    setTimeout(() => text.remove(), 1000);
}

woodenFish.addEventListener('click', () => {
    count++;
    clickCount.textContent = count;
    createMeritText();
    woodenFish.style.transform = 'scale(0.95)';
    setTimeout(() => woodenFish.style.transform = 'scale(1)', 100);
});

// 内容标签页切换
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// 留言板功能
const messageForm = document.getElementById('messageForm');
const messagesDiv = document.getElementById('messages');

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = messageForm.querySelector('input').value;
    const message = messageForm.querySelector('textarea').value;
    
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <strong>${name}</strong>
        <p>${message}</p>
        <small>${new Date().toLocaleString()}</small>
    `;
    
    messagesDiv.prepend(messageElement);
    messageForm.reset();
});

// 社交分享功能
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const text = '我发现了一个超无聊的网站！';
        const url = window.location.href;
        
        if(btn.classList.contains('weixin')) {
            alert('请截图分享到微信');
        } else if(btn.classList.contains('weibo')) {
            window.open(`http://service.weibo.com/share/share.php?url=${url}&title=${text}`);
        } else if(btn.classList.contains('qq')) {
            window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${text}`);
        }
    });
});

// 随机生成每日无聊挑战
const challenges = [
    "尝试盯着墙看5分钟，看看能发现什么有趣的图案",
    "数一数你房间里有多少个角落",
    "试着用左手写下你的名字",
    "对着镜子做鬼脸持续1分钟",
    "尝试不眨眼坚持30秒",
    "数数你能憋气多少秒"
];

function setDailyChallenge() {
    const today = new Date();
    const challengeIndex = today.getDate() % challenges.length;
    const challengeElement = document.querySelector('.hero p');
    challengeElement.textContent = `今日无聊挑战：${challenges[challengeIndex]}`;
}

document.addEventListener('DOMContentLoaded', setDailyChallenge); 