'use strict';

class Register {
  constructor(userName, registerUserBtn, loginBtn, listUsers){
    this.userName = document.querySelector(userName);
    this.registerUserBtn = document.querySelector(registerUserBtn);
    this.loginBtn = document.querySelector(loginBtn);
    this.listUsers = document.querySelector(listUsers);
    this.userData = (localStorage.userData) ? JSON.parse(localStorage.getItem('userData')) : [];
  }

  regDateUser() { 

  let months = ['Декабря', 'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 'Августа', 'Сентября', 'Октября', 'Ноября'],
      date = new Date(),
      currentDayOfMonth = date.getDate(),
      currentMonth = date.getMonth(),
      currentYear = date.getFullYear(),
      currentHours = date.getHours(),
      currentMinuts = date.getMinutes(),
      currentSeconds = date.getSeconds();

  const addZero = function (num) {
    if (num < 10) {
      num = '0' + num;
    }
    return num;
  }
    return `${addZero(currentDayOfMonth)} ${months[currentMonth]} ${currentYear} г., ${addZero(currentHours)}:${addZero(currentMinuts)}:${addZero(currentSeconds)}`;
  }

  addToStorage() {
    if(this.userData) localStorage.setItem('userData', JSON.stringify(this.userData));
  }

  render(){
    this.addToStorage();
    this.showUser();
  }

  showUser(){
    this.listUsers.textContent = '';
    this.userData.forEach((item) => {
      let li = document.createElement('li'),
          userDeleteBtn = document.createElement('button');
      li.key = item.login;    
      userDeleteBtn.classList.add('user-delete');    
      li.textContent = `Имя: ${item.firstName}, фамилия: ${item.lastName}, зарегистрирован: ${item.regDate}`;
      li.append(userDeleteBtn);
      this.listUsers.append(li);
      
    });

  }

  showError = ()=>{
    alert('Введите корректные данные');
  }

  queryUserData(){
    document.addEventListener('click', (e)=>{
      let target = e.target;

      try {

      if (target.matches('#register-user-btn')){
        let userName = prompt('Введите через пробел Имя и Фамилию пользователя').split(' ');
        
        if(userName.length === 1 || userName.length > 2 || userName === null){
          this.showError();
          return;
        }
        
        let userLogin = prompt('Введите ваш логин').toLowerCase();
        let user = this.userData.find((item) => item.login === userLogin);
        if (user && user.login === userLogin){
          alert('Извините, но этот логин уже занят, попробуйте другой!');
          return;
        } else if(userLogin === '' || userLogin === null){
          this.showError();
          return;
        }
        let userPassword = prompt('Введите ваш пароль');
        if(userPassword === '' || userPassword === null){
          this.showError();
          return;
        }
        const newUser = {
          firstName: userName[0],
          lastName: userName[1],
          login: userLogin,
          password: userPassword,
          regDate: this.regDateUser(),
        };
        this.userData.push(newUser);
        this.render();
        
      }
      } catch (e) {
        console.log(e);
      }
    });
  }

  deleteUsers(){
    document.addEventListener('click', (event)=>{
      let target = event.target;
      if (target.matches('.user-delete')){
        target = target.closest('li')
        target.remove();
        this.userData.forEach((item, index)=>{
          if(item.login === target.key){
            
            this.userData.splice(index, 1);
            this.render();
          }
        });
      };
    });
  }

  loginUser(){
    document.addEventListener('click', (event) => {
      let target = event.target;
      
      if(target.matches('#login-btn')){
        let queryUserLogin = prompt('Введите ваш логин');
        let queryUserPassword = prompt('Введите ваш пароль');
        let searchUser = this.userData.filter((item) => {
          return item.login === queryUserLogin && item.password === queryUserPassword;
        });
        if(searchUser.length > 0){
          this.userName.textContent = searchUser[0].firstName;
        }else{
          alert('Пользователь не найден'); 
        }
      }
    });
  }

  init() {
    this.queryUserData();
    this.showUser();
    this.deleteUsers();
    this.loginUser();
  }
}

const register = new Register('#user-name', '#register-user-btn', '#login-btn', '#list-users');

register.init();