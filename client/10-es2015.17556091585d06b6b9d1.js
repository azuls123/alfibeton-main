(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{fhSy:function(e,t,n){"use strict";n.r(t),n.d(t,"routes",(function(){return y})),n.d(t,"RegisterModule",(function(){return x}));var r=n("ofXK"),o=n("tyNb"),a=n("3Pt+"),l=n("fXoL");function i(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Full Name is required"),l["\u0275\u0275elementEnd"]())}function m(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Minimum of 3 characters"),l["\u0275\u0275elementEnd"]())}function s(e,t){if(1&e&&(l["\u0275\u0275elementStart"](0,"small",17),l["\u0275\u0275template"](1,i,2,0,"span",18),l["\u0275\u0275template"](2,m,2,0,"span",18),l["\u0275\u0275elementEnd"]()),2&e){const e=l["\u0275\u0275nextContext"]();l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("name").hasError("required")),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("name").hasError("minlength"))}}function d(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Email is required"),l["\u0275\u0275elementEnd"]())}function c(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Invalid email address"),l["\u0275\u0275elementEnd"]())}function p(e,t){if(1&e&&(l["\u0275\u0275elementStart"](0,"small",17),l["\u0275\u0275template"](1,d,2,0,"span",18),l["\u0275\u0275template"](2,c,2,0,"span",18),l["\u0275\u0275elementEnd"]()),2&e){const e=l["\u0275\u0275nextContext"]();l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("email").hasError("required")),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("email").hasError("invalidEmail"))}}function f(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Password is required"),l["\u0275\u0275elementEnd"]())}function u(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Password isn't long enough, minimum of 6 characters"),l["\u0275\u0275elementEnd"]())}function g(e,t){if(1&e&&(l["\u0275\u0275elementStart"](0,"small",17),l["\u0275\u0275template"](1,f,2,0,"span",18),l["\u0275\u0275template"](2,u,2,0,"span",18),l["\u0275\u0275elementEnd"]()),2&e){const e=l["\u0275\u0275nextContext"]();l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("password").hasError("required")),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("password").hasError("minlength"))}}function v(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Confirm Password is required"),l["\u0275\u0275elementEnd"]())}function h(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"span"),l["\u0275\u0275text"](1,"Passwords do not match"),l["\u0275\u0275elementEnd"]())}function E(e,t){if(1&e&&(l["\u0275\u0275elementStart"](0,"small",17),l["\u0275\u0275template"](1,v,2,0,"span",18),l["\u0275\u0275template"](2,h,2,0,"span",18),l["\u0275\u0275elementEnd"]()),2&e){const e=l["\u0275\u0275nextContext"]();l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("confirmPassword").hasError("required")),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",e.form.get("confirmPassword").hasError("mismatchedPasswords"))}}function w(e){if(e.value&&!/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/.test(e.value))return{invalidEmail:!0}}const y=[{path:"",component:(()=>{class e{constructor(e,t){this.router=e,this.form=t.group({name:["",a.v.compose([a.v.required,a.v.minLength(3)])],email:["",a.v.compose([a.v.required,w])],password:["",a.v.required],confirmPassword:["",a.v.required]},{validator:e=>{let t=e.controls.confirmPassword;if(e.controls.password.value!==t.value)return t.setErrors({mismatchedPasswords:!0})}}),this.name=this.form.controls.name,this.email=this.form.controls.email,this.password=this.form.controls.password,this.confirmPassword=this.form.controls.confirmPassword}onSubmit(e){this.form.valid&&(console.log(e),this.router.navigate(["/login"]))}ngAfterViewInit(){document.getElementById("preloader").classList.add("hide")}}return e.\u0275fac=function(t){return new(t||e)(l["\u0275\u0275directiveInject"](o.d),l["\u0275\u0275directiveInject"](a.b))},e.\u0275cmp=l["\u0275\u0275defineComponent"]({type:e,selectors:[["app-register"]],decls:31,vars:10,consts:[[1,"d-flex","justify-content-center","align-items-center","w-100","h-100","register-container"],[1,"col-xl-4","col-md-6","col-10"],[1,"card","border-0","box-shadow","rounded-0"],[1,"card-header","d-flex","justify-content-center","align-items-center","border-0","box-shadow"],["aria-hidden","true",1,"fa","fa-registered"],[1,"card-body","text-center","pb-1"],["routerLink","/login",1,"transition"],[1,"text-left","mt-4",3,"formGroup","ngSubmit"],[1,"form-group"],["placeholder","Full Name","type","text",1,"form-control","validation-field",3,"formControl"],["class","text-danger",4,"ngIf"],["placeholder","Email","type","text",1,"form-control","validation-field",3,"formControl"],["placeholder","Password","type","password","minlength","6",1,"form-control","validation-field",3,"formControl"],["placeholder","Confirm Password","type","password",1,"form-control","validation-field",3,"formControl"],[1,"terms"],["href","javascript:void(0);",1,"transition","terms"],["type","submit",1,"btn","btn-block",3,"disabled"],[1,"text-danger"],[4,"ngIf"]],template:function(e,t){1&e&&(l["\u0275\u0275elementStart"](0,"div",0),l["\u0275\u0275elementStart"](1,"div",1),l["\u0275\u0275elementStart"](2,"div",2),l["\u0275\u0275elementStart"](3,"div",3),l["\u0275\u0275element"](4,"i",4),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](5,"div",5),l["\u0275\u0275elementStart"](6,"h2"),l["\u0275\u0275text"](7,"Register member"),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](8,"a",6),l["\u0275\u0275text"](9,"Already have an account? Sign in!"),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](10,"form",7),l["\u0275\u0275listener"]("ngSubmit",(function(){return t.onSubmit(t.form.value)})),l["\u0275\u0275elementStart"](11,"div",8),l["\u0275\u0275element"](12,"input",9),l["\u0275\u0275template"](13,s,3,2,"small",10),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](14,"div",8),l["\u0275\u0275element"](15,"input",11),l["\u0275\u0275template"](16,p,3,2,"small",10),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](17,"div",8),l["\u0275\u0275element"](18,"input",12),l["\u0275\u0275template"](19,g,3,2,"small",10),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](20,"div",8),l["\u0275\u0275element"](21,"input",13),l["\u0275\u0275template"](22,E,3,2,"small",10),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](23,"div",8),l["\u0275\u0275elementStart"](24,"p",14),l["\u0275\u0275text"](25,"By creating an account, you agree our "),l["\u0275\u0275elementStart"](26,"a",15),l["\u0275\u0275text"](27,"Terms & Privacy Policy"),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementStart"](28,"div",8),l["\u0275\u0275elementStart"](29,"button",16),l["\u0275\u0275text"](30,"Sign up"),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"](),l["\u0275\u0275elementEnd"]()),2&e&&(l["\u0275\u0275advance"](10),l["\u0275\u0275property"]("formGroup",t.form),l["\u0275\u0275advance"](2),l["\u0275\u0275property"]("formControl",t.name),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",t.form.get("name").touched),l["\u0275\u0275advance"](2),l["\u0275\u0275property"]("formControl",t.email),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",t.form.get("email").touched),l["\u0275\u0275advance"](2),l["\u0275\u0275property"]("formControl",t.password),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",t.form.get("password").touched),l["\u0275\u0275advance"](2),l["\u0275\u0275property"]("formControl",t.confirmPassword),l["\u0275\u0275advance"](1),l["\u0275\u0275property"]("ngIf",t.form.get("confirmPassword").touched),l["\u0275\u0275advance"](7),l["\u0275\u0275property"]("disabled",!t.form.valid))},directives:[o.f,a.x,a.m,a.f,a.a,a.l,a.d,r.q,a.i],styles:[".register-container{position:absolute}.register-container .card .card-header{width:80px;height:80px;margin:-40px auto 0;border-radius:50%;font-size:36px}"],encapsulation:2}),e})(),pathMatch:"full"}];let x=(()=>{class e{}return e.\u0275mod=l["\u0275\u0275defineNgModule"]({type:e}),e.\u0275inj=l["\u0275\u0275defineInjector"]({factory:function(t){return new(t||e)},imports:[[r.c,a.g,a.s,o.g.forChild(y)]]}),e})()}}]);