// 登录功能实现
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // 调用登录API
    axios.post('http://localhost:8000/api/login/', {
        email: email,
        password: password
    })
    .then(response => {
        alert('登录成功');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('vehicle-list-page').style.display = 'block';
        loadVehicles(); // 加载车辆列表
    })
    .catch(error => {
        alert('登录失败，请检查邮箱和密码');
    });
});

// 加载车辆列表
function loadVehicles() {
    axios.get('http://localhost:8000/api/vehicles/')
    .then(response => {
        const vehicles = response.data;
        const vehicleList = document.getElementById('vehicle-list');
        vehicleList.innerHTML = ''; // 清空现有车辆列表

        vehicles.forEach(vehicle => {
            const vehicleHTML = `
                <div class="col-md-4 vehicle-card">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">${vehicle.type}</h5>
                            <p class="card-text">位置: ${vehicle.location}</p>
                            <p class="card-text">电池: ${vehicle.battery_level}%</p>
                            <button class="btn btn-primary" onclick="rentVehicle(${vehicle.id})">租借</button>
                            <button class="btn btn-danger mt-2" onclick="reportDefectiveVehicle(${vehicle.id})">报告故障</button>
                        </div>
                    </div>
                </div>
            `;
            vehicleList.innerHTML += vehicleHTML;
        });
    })
    .catch(error => {
        console.error('加载车辆失败', error);
    });
}

// 租借车辆
function rentVehicle(vehicleId) {
    axios.post(`http://localhost:8000/api/rent_vehicle/`, {
        vehicle_id: vehicleId
    })
    .then(response => {
        alert('车辆租借成功');
        loadVehicles(); // 重新加载车辆
    })
    .catch(error => {
        console.error('租借失败', error);
    });
}

// 报告故障车辆
function reportDefectiveVehicle(vehicleId) {
    axios.post(`http://localhost:8000/api/report_defective/`, {
        vehicle_id: vehicleId
    })
    .then(response => {
        alert('故障车辆已报告');
    })
    .catch(error => {
        console.error('报告故障失败', error);
    });
}

// 生成报告
function generateReport() {
    axios.get('/api/vehicle_reports/')
    .then(response => {
        const reportData = response.data;
        const ctx = document.getElementById('myChart').getContext('2d');
        
        const chart = new Chart(ctx, {
            type: 'bar', // 可以根据报告类型选择合适的图表类型
            data: {
                labels: reportData.labels, // 时间段或其他分类信息
                datasets: [{
                    label: '车辆活动报告',
                    data: reportData.data, // 数据源
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('生成报告失败', error);
    });
}
