let loginBtn;
let signBtn;

document.addEventListener("DOMContentLoaded", function (event) {
    signBtn = document.getElementById('sign-btn');

    signBtn.addEventListener('click', e => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let email = document.getElementById('semail').value;
        let password = document.getElementById('spass').value;
        let confirmPass = document.getElementById('cpass').value;

        if (name === "" || email === "" || password === "" || confirmPass === "") {
            let inp = document.getElementById("signup-inputs");
            let para = document.getElementById('signup-form-alert');
            para.classList.remove('disp-none');
            inp.classList.add('wrong-input');
            return;
        }
        else {
            let inp = document.getElementById("signup-inputs");
            let para = document.getElementById('signup-form-alert');
            if (!(para.classList.contains('disp-none'))) para.classList.add('disp-none');
            if ((inp.classList.contains('wrong-input'))) inp.classList.remove('wrong-input');
        }

        if ((password.localeCompare(confirmPass)) !== 0) {
            let pass = document.getElementById('spass');
            let cpass = document.getElementById('cpass');
            let para = document.getElementById('pass-alert');
            para.classList.remove('disp-none');
            pass.classList.add('wrong-input');
            cpass.classList.add('wrong-input');
            pass.addEventListener('click', () => {
                pass.classList.remove('wrong-input');
            })
            cpass.addEventListener('click', () => {
                cpass.classList.remove('wrong-input');
            });
            return;
        }
        else {
            let data = { name: name, email: email, password: password };
            fetch('/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => {
                return res.json();
            })
                .then(json => {
                    console.log("json");
                    if (!json.db) {
                        document.getElementById('server-alert').classList.remove('disp-none');
                        document.getElementById('server-alert-btn').addEventListener('click', () => {
                            document.getElementById('server-alert').classList.add('disp-none');
                        })
                    }
                    else if (!json.email) {
                        let email = document.getElementById('semail');
                        let para = document.getElementById('email-alert');
                        para.classList.remove('disp-none');
                        email.classList.add('wrong-input');
                        email.addEventListener('click', () => {
                            email.classList.remove('wrong-input');
                        });
                        return;
                    }
                    else if (json.email) {
                        window.location = '/login-page';
                        return;
                    }
                }).catch();
        }
    });

    loginBtn = document.getElementById('log-btn');

    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        let email = document.getElementById('lemail').value;
        let password = document.getElementById('lpass').value;

        if (email === "" || password === "") {
            let inp = document.getElementById("login-inputs");
            let para = document.getElementById('login-form-alert');
            para.classList.remove('disp-none');
            inp.classList.add('wrong-input');
            return;
        }
        else {
            let inp = document.getElementById("login-inputs");
            let para = document.getElementById('login-form-alert');
            if (!(para.classList.contains('disp-none'))) para.classList.add('disp-none');
            if ((inp.classList.contains('wrong-input'))) inp.classList.remove('wrong-input');
        }

        let data = { email: email, password: password };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            return res.json();
        }).then(json => {
                if(!json.status.db) {
                    console.log('done1');
                    document.getElementById('server-alert').classList.remove('disp-none');
                    document.getElementById('server-alert-btn').addEventListener('click', () => {
                        document.getElementById('server-alert').classList.add('disp-none');
                    });
                    return;
                }
                else if(!json.status.email) {
                    console.log('done2');
                    let email = document.getElementById('lemail');
                    let para = document.getElementById('wrong-email');
                    para.classList.remove('disp-none');
                    email.classList.add('wrong-input');
                    email.addEventListener('click', () => {
                        email.classList.remove('wrong-input');
                    });
                    return;
                }
                else if(json.status.email && !json.status.password) {
                    console.log('done3');
                    let pass = document.getElementById('lpass');
                    let para = document.getElementById('wrong-pass');
                    para.classList.remove('disp-none');
                    pass.classList.add('wrong-input');
                    pass.addEventListener('click', () => {
                        pass.classList.remove('wrong-input');
                    });
                    return;
                }
                else if(json.status.email && json.status.password) {
                    console.log('done4');
                    window.location = '/bookings';
                    return;
                }
            }).catch(() => {
            });
    })
});