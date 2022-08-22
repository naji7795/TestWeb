var picker = {

  instances : [],
  attach : (opt) => {
   
    opt.target = document.getElementById(opt.target);
    opt.target.readOnly = true; 
    if (opt.container) { opt.container = document.getElementById(opt.container); }
    opt.startmon = opt.startmon ? true : false;
    opt.yrange = opt.yrange ? opt.yrange : 10;
    const id = picker.instances.length;
    picker.instances.push(opt);
    let inst = picker.instances[id];

    
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        temp, today = new Date(),
        thisMonth = today.getUTCMonth(), // JAN IS 0
        thisYear = today.getUTCFullYear();

   
    inst.hPick = document.createElement("div");
    inst.hPick.classList.add("picker");

   
    inst.hMonth = document.createElement("select");
    inst.hMonth.classList.add("picker-m");
    for (let m in months) {
      temp = document.createElement("option");
      temp.value = +m + 1;
      temp.text = months[m];
      inst.hMonth.appendChild(temp);
    }
    inst.hMonth.selectedIndex = thisMonth;
    inst.hMonth.onchange = () => { picker.draw(id); };
    inst.hPick.appendChild(inst.hMonth);

   
    inst.hYear = document.createElement("select");
    inst.hYear.classList.add("picker-y");
    for (let y = thisYear-inst.yrange; y < thisYear+inst.yrange; y++) {
      temp = document.createElement("option");
      temp.value = y;
      temp.text = y;
      inst.hYear.appendChild(temp);
    }
    inst.hYear.selectedIndex = inst.yrange;
    inst.hYear.onchange = () => { picker.draw(id); };
    inst.hPick.appendChild(inst.hYear);

  
    inst.hDays = document.createElement("div");
    inst.hDays.classList.add("picker-d");
    inst.hPick.appendChild(inst.hDays);
    picker.draw(id);

  
    if (inst.container) { inst.container.appendChild(inst.hPick); }

 
    else {
    
      inst.hWrap = document.createElement("div");
      inst.hWrap.classList.add("picker-wrap");
      inst.hWrap.appendChild(inst.hPick);

      inst.target.onfocus = () => {
        inst.hWrap.classList.add("show");
      };
      inst.hWrap.onclick = (evt) => { if (evt.target == inst.hWrap) {
        inst.hWrap.classList.remove("show");
      }};

    
      document.body.appendChild(inst.hWrap);
    }
  },


  draw : (id) => {
       let inst = picker.instances[id],
        month = inst.hMonth.value,
        year = inst.hYear.value;

    let daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate(),
        startDay = new Date(Date.UTC(year, month-1, 1)).getUTCDay(), // SUN IS 0
        endDay = new Date(Date.UTC(year, month-1, daysInMonth)).getUTCDay();
    startDay = startDay==0 ? 7 : startDay,
    endDay = endDay==0 ? 7 : endDay;

 
    let today = new Date(), todayDate = null;
    if (today.getUTCMonth()+1 == month && today.getUTCFullYear() == year) {
      todayDate = today.getUTCDate();
    }


    let daynames = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    if (inst.startmon) { daynames.push("Sun"); }
    else { daynames.unshift("Sun"); }

   
    let table, row, cell, squares = [];

  
    if (inst.startmon && startDay!=1) {
      for (let i=1; i<startDay; i++) { squares.push("B"); }
    }
    if (!inst.startmon && startDay!=7) {
      for (let i=0; i<startDay; i++) { squares.push("B"); }
    }

    if (inst.disableday) {
      let thisDay = startDay;
      for (let i=1; i<=daysInMonth; i++) {
        squares.push([i, inst.disableday.includes(thisDay)]);
        thisDay++;
        if (thisDay==8) { thisDay = 1; }
      }
    }

    else {
      for (let i=1; i<=daysInMonth; i++) { squares.push([i, false]);  }
    }

    if (inst.startmon && endDay!=7) {
      for (let i=endDay; i<7; i++) { squares.push("B"); }
    }
    if (!inst.startmon && endDay!=6) {
      for (let i=endDay; i<(endDay==7?13:6); i++) { squares.push("B"); }
    }

    table = document.createElement("table");
    row = table.insertRow();
    row.classList.add("picker-d-h");
    for (let d of daynames) {
      cell = row.insertCell();
      cell.innerHTML = d;
    }

    row = table.insertRow();
    for (let i=0; i<squares.length; i++) {
      if (i!=squares.length && i%7==0) { row = table.insertRow(); }
      cell = row.insertCell();
      if (squares[i] == "B") { cell.classList.add("picker-d-b"); }
      else {
  
        cell.innerHTML = squares[i][0];

       
        if (squares[i][1]) { cell.classList.add("picker-d-dd"); }

     
        else {
          if (squares[i][0] == todayDate) { cell.classList.add("picker-d-td"); }
          cell.classList.add("picker-d-d");
          cell.onclick = () => { picker.pick(id, squares[i][0]); }
        }
      }
    }

    inst.hDays.innerHTML = "";
    inst.hDays.appendChild(table);
  },


  pick : (id, day) => {
  
    let inst = picker.instances[id],
        month = inst.hMonth.value,
        year = inst.hYear.value;

    if (+month<10) { month = "0" + month; }
    if (+day<10) { day = "0" + day; }
    inst.target.value = `${year}-${month}-${day}`;


    if (inst.container === undefined) {
      inst.hWrap.classList.remove("show");
    }

 
    if (inst.onpick) { inst.onpick(); }
  }
};
