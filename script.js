// ===== USERS =====
const users = [
    { id:1, username:"Modan", password:"1234", location:"Factory 1" },
    { id:2, username:"Baldeya", password:"1234", location:"Factory 2" },
    { id:3, username:"Al-khraj", password:"1234", location:"Factory 3" },
    { id:4, username:"manager", password:"admin", location:"all" }
];

let currentUser=null;

// ===== MACHINES DATA =====
const locations=["Factory 1","Factory 2","Factory 3"];
const machinesData={};
locations.forEach((loc,i)=>{
    machinesData[loc]=Array.from({length:10},(_,idx)=>({
        id:i*10+idx+1,
        name:`Machine ${idx+1}`,
        speed:`${40+idx*5} m/hr`,
        status:"free",
        order:null
    }));
});

// ===== WORK ORDERS =====
const workOrders=[
    {id:1,product_name:"HDPE Pipe 32mm",size:"32mm",total_qty:120,location:"Factory 1"},
    {id:2,product_name:"HDPE Pipe 40mm",size:"40mm",total_qty:80,location:"Factory 2"},
    {id:3,product_name:"HDPE Pipe 50mm",size:"50mm",total_qty:150,location:"Factory 3"}
];

// ===== LOGIN =====
document.getElementById("login-form").addEventListener("submit", e=>{
    e.preventDefault();
    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value.trim();
    const user=users.find(u=>u.username===username && u.password===password);

    if(user){
        currentUser=user;
        assignWorkOrders();
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");
        showDashboard();
    } else {
        alert("Invalid username or password!");
    }
});

// ===== ASSIGN WORK ORDERS =====
function assignWorkOrders(){
    workOrders.forEach(order=>{
        const freeMachine=machinesData[order.location].find(m=>m.status==="free");
        if(freeMachine){
            freeMachine.status="running";
            freeMachine.order={
                product_name:order.product_name,
                size:order.size,
                total_qty:order.total_qty,
                completed_qty:0,
                estimated_completion_time:"12:00 PM"
            };
        }
    });
}

// ===== DASHBOARD =====
function showDashboard(){
    const locs=currentUser.location==="all"?locations:[currentUser.location];
    locs.forEach(loc=>renderLocation(loc));
}

// ===== RENDER LOCATION =====
function renderLocation(location){
    const container=document.getElementById("locations");
    const locCard=document.createElement("div");
    locCard.className="location-card";
    locCard.innerHTML=`<h2>${location}</h2><div class="machines-grid" id="grid-${location.replace(/\s/g,'')}"></div>`;
    container.appendChild(locCard);
    renderMachines(location);
}

// ===== RENDER MACHINES =====
function renderMachines(location){
    const grid=document.getElementById(`grid-${location.replace(/\s/g,'')}`);
    grid.innerHTML="";
    machinesData[location].forEach(machine=>{
        const card=document.createElement("div");
        card.className="machine-card";

        const statusClass=machine.status==="free"?"status-free":machine.status==="running"?"status-running":"status-stopped";
        const progress=machine.order?Math.floor((machine.order.completed_qty/machine.order.total_qty)*100):0;

        card.innerHTML = `
            <h3>${machine.name}</h3>
            <p>Status: <span class="status-badge ${statusClass}">${machine.status.toUpperCase()}</span></p>
            <p>Speed: ${machine.speed}</p>

            ${machine.order ? `
            <div class="job-card">
                <h4>Job Card</h4>
                <p>Product: ${machine.order.product_name}</p>
                <p>Size: ${machine.order.size}</p>
                <p>Total Qty: ${machine.order.total_qty}</p>
                <p>Completed: <input type="number" value="${machine.order.completed_qty}" min="0" max="${machine.order.total_qty}" onchange="updateCompleted('${location}',${machine.id},this.value)"></p>
                <p>Remaining: ${machine.order.total_qty - machine.order.completed_qty}</p>
                <p>ETA: ${machine.order.estimated_completion_time}</p>
            </div>
            ` : `<p>No job assigned</p>` }

            <div class="progress-container">
                <div class="progress-bar" style="width:${progress}%"></div>
            </div>
            <button class="start-btn" onclick="startMachine('${location}',${machine.id})">Start</button>
            <button class="stop-btn" onclick="stopMachine('${location}',${machine.id})">Stop</button>
        `;
        grid.appendChild(card);
    });
}

// ===== UPDATE COMPLETED =====
function updateCompleted(location,machineId,value){
    const machine=machinesData[location].find(m=>m.id===machineId);
    if(machine && machine.order){
        machine.order.completed_qty=parseInt(value);
        renderMachines(location);
    }
}

// ===== START MACHINE =====
function startMachine(location,machineId){
    const machine=machinesData[location].find(m=>m.id===machineId);
    if(machine.status==="running"){ alert("Machine already running!"); return; }
    machine.status="running";
    if(!machine.order){
        machine.order={product_name:"HDPE Pipe",size:"32mm",total_qty:100,completed_qty:0,estimated_completion_time:"12:00 PM"};
    }
    renderMachines(location);
}

// ===== STOP MACHINE =====
function stopMachine(location,machineId){
    const machine=machinesData[location].find(m=>m.id===machineId);
    if(machine.status!=="running"){ alert("Machine is not running!"); return; }
    machine.status="stopped";
    renderMachines(location);
}
