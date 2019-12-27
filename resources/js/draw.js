'use strict';
function DrawText(options) {
    this._init_(options);

    this.render();
}

DrawText.prototype = {
    keyEventListener: true,
    mouseMoveEventListener: true,
    constructor: DrawText,
    scene: null,
    world:null,
    camera: null,
    renderer: null,
    textMeshs: [],
    cubes: [],
    tanks: [],
    bullets: [],
    ground:null,
    debug:null,
    options: {
        fontSize: 5,
        cubeSize: 2,
        textArr: [
            {
                text: 'A',
            },
            {
                text: 'M'
            },
            {
                text: 'O'
            },
            {
                text: 'R'
            }
        ]
    },
    _init_: function (options) {
        if (options != null) {
            this.options = this.options || options;
        }


        //screen
        this.initScene();
        //camera
        this.initCamera();

        //light
        this.initLight();

       
        // let lights = [];
        // lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 0 ].position.set( 0, 200, 0 );
        // lights[ 1 ].position.set( 100, 200, 100 );
        // lights[ 2 ].position.set( - 100, - 200, - 100 );
        // this.scene.add( lights[ 0 ] );
        // this.scene.add( lights[ 1 ] );
        // this.scene.add( lights[ 2 ] );

        // let ambientLight = new THREE.AmbientLight( 0x000000 );
        // this.scene.add( ambientLight );

        //renderer
        this.initRenderer();

        this.textMeshs = new THREE.Group();
        this.textMeshs.position.set(0,40,0);
        this.scene.add(this.textMeshs);

        //初始化天空盒
        this.initSkyBox();

        this.createPlane();

        this.createCube();

        this.createTank();

        //辅助工具
        this.initHelper();

        // let geometry1 = new THREE.BoxGeometry( 2, 1, 1 );
        // let material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // let cube1 = new THREE.Mesh( geometry1, material1 );
        // this.cubes.add(cube1);

        // let geometry2 = new THREE.BoxGeometry( 1, 2, 1 );
        // let material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // let cube2 = new THREE.Mesh( geometry2, material2 );
        // this.cubes.add(cube2);        



        this.fontLoad();
        // this.createText(this.options.textArr);

        this.debug = new THREE.CannonDebugRenderer(this.scene, this.world)

        this.render();
        addEventListener("resize",()=>{
            //renderer
            this.initRenderer();

        });
        addEventListener("mousemove",(e)=>{
            if(this.mouseMoveEventListener){
                this.mouseMoveEventListener = false;
                 //movementX > 0 鼠标向右移动
                //movementX < 0 鼠标向左移动 
                if(e.movementX > 0){
                    this.camera.rotateY(-Math.PI / 180 * 2);
                }else if(e.movementX < 0){
                    this.camera.rotateY(Math.PI / 180 * 2);
                }
                this.mouseMoveEventListener = true;
            }
           
        });
        addEventListener("keyup",(e)=>{
            if(this.keyEventListener){
                this.keyEventListener = false;
                for(let tank of this.tanks){
                    if(tank.isUser){
                        if(e.key === "ArrowLeft"){
                            if(tank.forward === 1){
                                tank.move();
                                console.log('前进');
                            }else if(tank.forward === 0){
                                tank.rotate(-1);
                                console.log('左转90度');
                            }else if(tank.forward === 2){
                                tank.rotate(1);
                                console.log('右转90度');
                            }else if(tank.forward === 3){
                                tank.rotate(2);
                                console.log('转180度');
                            }
                            tank.forward = 1;
                            
                        }
                        if(e.key === "ArrowRight"){
                            if(tank.forward === 3){
                                tank.move();
                                console.log('前进');
                            }else if(tank.forward === 0){
                                tank.rotate(1);
                                console.log('右转90度');
                            }else if(tank.forward === 1){
                                tank.rotate(2);
                                console.log('转180度');
                            }else if(tank.forward === 2){
                                tank.rotate(-1);
                                console.log('左转90度');
                            }
                            tank.forward = 3;
                        }
                        if(e.key === "ArrowUp"){
                            if(tank.forward === 0){
                                tank.move();
                                console.log('前进');
                            }else if(tank.forward === 1){
                                tank.rotate(1);
                                console.log('右转90度');
                            }else if(tank.forward === 2){
                                tank.rotate(2);
                                console.log('转180度');
                            }else if(tank.forward === 3){
                                tank.rotate(-1);
                                console.log('左转90度');
                            }
                            tank.forward = 0;
                        }
                        if(e.key === "ArrowDown"){
                            if(tank.forward === 2){
                                tank.move();
                                console.log('前进');
                            }else if(tank.forward === 0){
                                tank.rotate(2);
                                console.log('转180度');
                            }else if(tank.forward === 1){
                                tank.rotate(-1);
                                console.log('左转90度');
                            }else if(tank.forward === 3){
                                tank.rotate(1);
                                console.log('右转90度');
                            }
                            tank.forward = 2;
                        }
                        if(e.key === " "){
                            tank.shoot();
                        }
                    }
                }
                this.keyEventListener = true;
            }
        });
    },
    initRenderer: function () {
        if(!this.renderer){
            this.renderer = new THREE.WebGLRenderer();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            //需要阴影
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 默认的是，没有设置的这个清晰 THREE.PCFShadowMap
            document.body.appendChild(this.renderer.domElement);
        }else{
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }
        // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
        this.camera.aspect = window.innerWidth/window.innerHeight;
        // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
        // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
        // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
        this.camera.updateProjectionMatrix ();
        
    },
    initScene: function () {
        this.scene = new THREE.Scene();
        
        this.world = new CANNON.World();
        //设置重力方向为y周向下9.8m/s²
        this.world.gravity.set(0, -9.8, 0);
        //设置碰撞检测
        this.world.broadphase = new CANNON.NaiveBroadphase()
    },
    initCamera: function () {
        /**
         * 视角
         * 宽高比
         * 近平面距离
         * 远平面距离
         */
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        if(this.isPC()){
            console.log("is PC");
            this.camera.position.set(0, 20, 50);
        }else{
            console.log("is not PC");
            this.camera.position.set(0, 40, 150);
        }
        // this.camera.lookAt(0,0,0);
        
    },
    initLight: function () {
        if(!this.light){
            this.light = new THREE.DirectionalLight(0xffffff);
            //告诉平行光需要开启阴影投射
            this.light.castShadow = true;
            this.light.position.set(-5, 10, 5);
            this.scene.add(this.light);
        }
        
    },
    initHelper:function(){
        let axisHelper = new THREE.AxisHelper(10);
        let cameraHelper = new THREE.CameraHelper(this.camera);
        // let lightHelper = new THREE.DirectionalLightHelper(0xffffff);
        this.scene.add(axisHelper);
        this.scene.add(cameraHelper);
        // this.scene.add(lightHelper);
    },
    render: function () {
        window.requestAnimationFrame(
            () => {
                this.render();
            }
        );

        this.world.step(1 / 60);

        if(this.cubes.length > 0){
            for(let cube of this.cubes){
                cube.shape.position.copy(cube.physics.position);
                cube.shape.quaternion.copy(cube.physics.quaternion);
            }
        }

        //物体辅助线
        // this.debug.update();

        this.textMeshs.rotation.y += 0.01;

        this.renderer.render(this.scene, this.camera);
    },
    createCube: function () {
        let size = this.options.cubeSize;
        let color = 0xCC6633;
        let offsetZ = 15;
        let cubepositions= [
            [-1 - 15 ,0 ,0 - offsetZ],
            [0 - 15 ,0 ,0 - offsetZ],
            [1 - 15 ,0 ,0 - offsetZ],
            [-2 - 15 ,0 ,1 - offsetZ],
            [-1 - 15 ,0 ,1 - offsetZ],
            [1 - 15 ,0 ,1 - offsetZ],
            [2 - 15 ,0 ,1 - offsetZ],
            [-3 - 15 ,0 ,2 - offsetZ],
            [3 - 15 ,0 ,2 - offsetZ],
            [-2 - 15 ,0 ,2 - offsetZ],
            [2 - 15 ,0 ,2 - offsetZ],
            [-3 - 15 ,0 ,3 - offsetZ],
            [-2 - 15 ,0 ,3 - offsetZ],
            [2 - 15 ,0 ,3 - offsetZ],
            [3 - 15 ,0 ,3 - offsetZ],
            [-3 - 15 ,0 ,4 - offsetZ],
            [-2 - 15 ,0 ,4 - offsetZ],
            [-1 - 15 ,0 ,4 - offsetZ],
            [0 - 15 ,0 ,4 - offsetZ],
            [1 - 15 ,0 ,4 - offsetZ],
            [2 - 15 ,0 ,4 - offsetZ],
            [3 - 15 ,0 ,4 - offsetZ],
            [-3 - 15 ,0 ,5 - offsetZ],
            [-2 - 15 ,0 ,5 - offsetZ],
            [2 - 15 ,0 ,5 - offsetZ],
            [3 - 15 ,0 ,5 - offsetZ],
            [-3 - 15 ,0 ,6 - offsetZ],
            [-2 - 15 ,0 ,6 - offsetZ],
            [2 - 15 ,0 ,6 - offsetZ],
            [3 - 15 ,0 ,6 - offsetZ],

            [-3 - 5 ,0 , 0 - offsetZ],
            [-2 - 5 ,0 , 0 - offsetZ],
            [2 - 5 ,0 , 0 - offsetZ],
            [3 - 5 ,0 , 0 - offsetZ],
            [-3 - 5 ,0 , 1 - offsetZ],
            [-2 - 5 ,0 , 1 - offsetZ],
            [-1 - 5 ,0 , 1 - offsetZ],
            [1 - 5 ,0 , 1 - offsetZ],
            [2 - 5 ,0 , 1 - offsetZ],
            [3 - 5 ,0 , 1 - offsetZ],
            [-3 - 5 ,0 , 2 - offsetZ],
            [-2 - 5 ,0 , 2 - offsetZ],
            [-1 - 5 ,0 , 2 - offsetZ],
            [0 - 5 ,0 , 2 - offsetZ],
            [1 - 5 ,0 , 2 - offsetZ],
            [2 - 5 ,0 , 2 - offsetZ],
            [3 - 5 ,0 , 2 - offsetZ],
            [-3 - 5 ,0 , 3 - offsetZ],
            [-2 - 5 ,0 , 3 - offsetZ],
            [0 - 5 ,0 , 3 - offsetZ],
            [2 - 5 ,0 , 3 - offsetZ],
            [3 - 5 ,0 , 3 - offsetZ],
            [-3 - 5 ,0 , 4 - offsetZ],
            [-2 - 5 ,0 , 4 - offsetZ],
            [2 - 5 ,0 , 4 - offsetZ],
            [3 - 5 ,0 , 4 - offsetZ],
            [-3 - 5 ,0 , 5 - offsetZ],
            [-2 - 5 ,0 , 5 - offsetZ],
            [2 - 5 ,0 , 5 - offsetZ],
            [3 - 5 ,0 , 5 - offsetZ],
            [-3 - 5 ,0 , 6 - offsetZ],
            [-2 - 5 ,0 , 6 - offsetZ],
            [2 - 5 ,0 , 6 - offsetZ],
            [3 - 5 ,0 , 6 - offsetZ],

            [-1 + 5 ,0 ,0 - offsetZ],
            [0 + 5 ,0 ,0 - offsetZ],
            [1 + 5 ,0 ,0 - offsetZ],
            [-2 + 5 ,0 ,1 - offsetZ],
            [-1 + 5 ,0 ,1 - offsetZ],
            [1 + 5 ,0 ,1 - offsetZ],
            [2 + 5 ,0 ,1 - offsetZ],
            [-3 + 5 ,0 ,2 - offsetZ],
            [-2 + 5 ,0 ,2 - offsetZ],
            [2 + 5 ,0 ,2 - offsetZ],
            [3 + 5 ,0 ,2 - offsetZ],
            [-3 + 5 ,0 ,3 - offsetZ],
            [-2 + 5 ,0 ,3 - offsetZ],
            [2 + 5 ,0 ,3 - offsetZ],
            [3 + 5 ,0 ,3 - offsetZ],
            [-3 + 5 ,0 ,4 - offsetZ],
            [-2 + 5 ,0 ,4 - offsetZ],
            [2 + 5 ,0 ,4 - offsetZ],
            [3 + 5 ,0 ,4 - offsetZ],
            [-2 + 5 ,0 ,5 - offsetZ],
            [-1 + 5 ,0 ,5 - offsetZ],
            [1 + 5 ,0 ,5 - offsetZ],
            [2 + 5 ,0 ,5 - offsetZ],
            [-1 + 5 ,0 ,6 - offsetZ],
            [0 + 5 ,0 ,6 - offsetZ],
            [1 + 5 ,0 ,6 - offsetZ],

            [-3 + 15 ,0 , 0 - offsetZ],
            [-2 + 15 ,0 , 0 - offsetZ],
            [-1 + 15 ,0 , 0 - offsetZ],
            [0 + 15 ,0 , 0 - offsetZ],
            [1 + 15 ,0 , 0 - offsetZ],
            [2 + 15 ,0 , 0 - offsetZ],
            [-3 + 15 ,0 , 1 - offsetZ],
            [-2 + 15 ,0 , 1 - offsetZ],
            [2 + 15 ,0 , 1 - offsetZ],
            [3 + 15 ,0 , 1 - offsetZ],
            [-3 + 15 ,0 , 2 - offsetZ],
            [-2 + 15 ,0 , 2 - offsetZ],
            [2 + 15 ,0 , 2 - offsetZ],
            [3 + 15 ,0 , 2 - offsetZ],
            [-3 + 15 ,0 , 3 - offsetZ],
            [-2 + 15 ,0 , 3 - offsetZ],
            [-1 + 15 ,0 , 3 - offsetZ],
            [0 + 15 ,0 , 3 - offsetZ],
            [1 + 15 ,0 , 3 - offsetZ],
            [2 + 15 ,0 , 3 - offsetZ],
            [-3 + 15 ,0 , 4 - offsetZ],
            [-2 + 15 ,0 , 4 - offsetZ],
            [0 + 15 ,0 , 4 - offsetZ],
            [1 + 15 ,0 , 4 - offsetZ],
            [-3 + 15 ,0 , 5 - offsetZ],
            [-2 + 15 ,0 , 5 - offsetZ],
            [1 + 15 ,0 , 5 - offsetZ],
            [2 + 15 ,0 , 5 - offsetZ],
            [-3 + 15 ,0 , 6 - offsetZ],
            [-2 + 15 ,0 , 6 - offsetZ],
            [2 + 15 ,0 , 6 - offsetZ],
            [3 + 15 ,0 , 6 - offsetZ],
        ];

        for(let pos of cubepositions){
            ////物理
            let shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2 , size / 2)); // 形状
            let shapeMaterial = new CANNON.Material();  // 材质
            let shapeBody = new CANNON.Body({ // 刚体
                mass: 5,    //质量
                material: shapeMaterial,
                shape:shape
            });
            shapeBody.position.set(size * pos[0],size * pos[1], size * pos[2]);



            this.world.add(shapeBody);

            let sphere_ground = new CANNON.ContactMaterial(this.ground.physics.material, shapeMaterial, { //  定义两个刚体相遇后会发生什么
                friction: 1,    // 摩擦系数
                restitution: 0.4    // 恢复系数
            })
            this.world.addContactMaterial(sphere_ground) // 添加到世界中

            //////
            let geometry = new THREE.CubeGeometry(size,size,size);
            //一种非发光材料
            let material = new THREE.MeshLambertMaterial({ color: color });
            let cube = new THREE.Mesh(geometry, material);
            //告诉立方体需要投射阴影
            cube.castShadow = true;
            cube.position.set(size * pos[0],size * pos[1], size * pos[2]);

            this.cubes.push({
                shape:cube,
                physics:shapeBody,
                type: 0 // type :0 ,wall
            });
            
            this.scene.add(cube);
        }

   
    },
    createPlane:function(){
        //底部物理平面
        let groundShape = new CANNON.Plane();   // 形状
        let groundMaterial = new CANNON.Material(); // 材质
        let groundBody = new CANNON.Body({  // 刚体
            mass: 0,    // 质量，质量为0时为静态刚体
            shape: groundShape,
            material: groundMaterial 
        })
        // setFromAxisAngle 旋转 X 轴 -90 度
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
        groundBody.position.set(0,-1,0);
        this.world.add(groundBody)


        ////底部平面
        let planeGeometry = new THREE.PlaneGeometry(1000,1000);
        let planeMaterial = new THREE.MeshStandardMaterial({color:0xaaaaaa});

        let plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.set(-Math.PI / 2,0,0);
        plane.position.set(0,-1,0);

        //告诉底部平面需要接收阴影
        plane.receiveShadow = true;

        plane.position.copy(groundBody.position);
        plane.quaternion.copy(groundBody.quaternion);


        this.ground = {
            shape:plane,
            physics:groundBody
        };

        this.scene.add(plane);


       


    },
    createTank: function(){
        let tankPos = [0,0,0];
        let size = this.options.cubeSize;
        let tank = new THREE.Group();
        let color = 0x00ff00;


        ////物理
        let shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2 , size / 2)); // 形状
        let shapeMaterial = new CANNON.Material();  // 材质
        let shapeBody = new CANNON.Body({ // 刚体
            mass: 5,    //质量
            material: shapeMaterial,
            shape:shape
        });
        shapeBody.position.set(size * tankPos[0],size * tankPos[1], size * tankPos[2]);



        this.world.add(shapeBody);

        let sphere_ground = new CANNON.ContactMaterial(this.ground.physics.material, shapeMaterial, { //  定义两个刚体相遇后会发生什么
            friction: 1,    // 摩擦系数
            restitution: 0.4    // 恢复系数
        })
        this.world.addContactMaterial(sphere_ground) // 添加到世界中

        //////
        let tankBaseGeometry = new THREE.CubeGeometry(size, size / 2, size);//基座
        let tankBatteryGeometry = new THREE.CubeGeometry(size / 2, size / 2, size / 2);//炮台
        let tankBarrelGeometry = new THREE.CubeGeometry(size / 8, size / 8, size / 2); // 炮筒
        //一种非发光材料
        let material = new THREE.MeshLambertMaterial({ color: color });

        let tankBaseCube = new THREE.Mesh(tankBaseGeometry, material);
        let tankBatteryCube = new  THREE.Mesh(tankBatteryGeometry,material);
        let tankBarrelCube = new THREE.Mesh(tankBarrelGeometry.material);
        //告诉立方体需要投射阴影
        tankBaseCube.castShadow = true;
        tankBatteryCube.castShadow = true;
        tankBarrelCube.castShadow = true;
        tankBaseCube.position.set(size * tankPos[0], size * tankPos[1], size * tankPos[2]);
        tankBatteryCube.position.set(size * tankPos[0], (size * tankPos[1] + 1 / 2), size * (tankPos[2] + 1 / 4));
        tankBarrelCube.position.set(size * tankPos[0], (size * tankPos[1] + 1 / 2), size * (tankPos[2] - 1 / 4));

        tank.add(tankBaseCube);
        tank.add(tankBatteryCube);
        tank.add(tankBarrelCube);
        let that = this;
        this.tanks.push({
            that:that,
            forward: 0,//0: 前;1：左;2：后;3：右
            isUser: true,
            shape: tank,
            physics: shapeBody,
            rotate:function(deg){
                //-1左，1右，2平角
                this.shape.rotateY(-Math.PI/2 * deg);
                this.physics.quaternion.copy(this.shape.quaternion);
            },
            shoot: function(){

            },
            move: function(){
                this.shape.translateZ(-that.options.cubeSize);
                this.physics.position.copy(this.shape.position);
            }

        });
        
        this.scene.add(tank);

    },
    initSkyBox: function(){
         //设置天空盒
         let path = "../resources/images/skys/";//设置路径
         let directions  = ["px_ys", "nx_ys", "py_ys", "ny_ys", "pz_ys", "nz_ys"];//获取对象
         let format = ".jpg";//格式
         //创建盒子，并设置盒子的大小为( 1000, 1000, 1000 )
         let cubeSize = 1000;
         let skyGeometry = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
         //设置盒子材质
         let materialArray = [];
         // for (let i = 0; i < 6; i++){
         //     materialArray.push( new THREE.MeshBasicMaterial({
         //         map: new THREE.TextureLoader().load( path + directions[i] + format ),//将图片纹理贴上
         //         side: THREE.BackSide                  //镜像翻转，如果设置镜像翻转，那么只会看到黑漆漆的一片，因为你身处在盒子的内部，所以一定要设置镜像翻转
         //     }));
         // }
        
         for (let i = 0; i < 6; i++){
            materialArray.push( new THREE.MeshBasicMaterial({
                 map: new THREE.TextureLoader().load( path + directions[i] + format ),//将图片纹理贴上
                 side: THREE.BackSide                  //镜像翻转，如果设置镜像翻转，那么只会看到黑漆漆的一片，因为你身处在盒子的内部，所以一定要设置镜像翻转
            }));
         }
 
         let skyBox = new THREE.Mesh( skyGeometry, materialArray );
         skyBox.position.set(0,cubeSize / 2 - 1 / 2,0);
         this.scene.add(skyBox);
    },
    /**
     * [{
     *      text:text,
     *      font:font,//THREE. 字体
     *      size:size,//Float. 大小.
     *      height:height,//Float. 文字厚度. 默认值为50.
     *      curveSegments:curveSegments,//Integer. 曲线上点的数量. 默认值为12.
     *      bevelEnabled:bevelEnabled,//Boolean. 是否打开斜面. 默认值为False.
     *      bevelThickness:bevelThickness, //Float. 文本斜面的深度. 默认值为10.
     *      bevelSize:bevelSize //斜面离轮廓的距离. 默认值为8.
     * },...]
     */
    createText: function (textOptions,fontSize) {

        let materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
        ];
        let that = this;
        textOptions.map(function ({ text, parameters }, index, array) {
            let textGeo;
            if (parameters) {
                textGeo = new THREE.TextGeometry(text, parameters);
            } else {
                textGeo = new THREE.TextGeometry(text, {
                    font: that.font,
                    size: fontSize,
                    height: fontSize,
                    // curveSegments: 12,
                    // bevelThickness: false,
                    // bevelSize: 10,
                    // bevelEnabled: 8
                });
            }
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();
            textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
            let textMesh = new THREE.Mesh(textGeo, materials);
            textMesh.position.x = (index - 2) * fontSize;
            textMesh.castShadow = true;
            that.textMeshs.add(textMesh);
        });
        // for( {text,parameters} of textOptions){
        //     let textGeo;
        //     if(parameters){
        //         textGeo = new THREE.TextGeometry( text, parameters);
        //     }else{
        //         textGeo = new THREE.TextGeometry( text,{
        //             font: this.font,
        // 			size: 1,
        // 			height: 1,
        // 			// curveSegments: 12,
        // 			// bevelThickness: false,
        // 			// bevelSize: 10,
        // 			// bevelEnabled: 8
        //         });
        //     }
        //     textGeo.computeBoundingBox();
        //     textGeo.computeVertexNormals();
        //     textGeo = new THREE.BufferGeometry().fromGeometry( textGeo );
        //     let textMesh = new THREE.Mesh( textGeo, materials );

        //     this.textMeshs.add(textMesh);
        // }
    },
    fontLoad: function () {
        let loader = new THREE.FontLoader();

        // Font	Weight	Style	文件路径
        // helvetiker	normal	normal	../../node_modules/three/examples/fonts/helvetiker_regular.typeface.json
        // helvetiker	bold	normal	../../node_modules/three/examples/fonts/helvetiker_bold.typeface.json
        // optimer	normal	normal	../../node_modules/three/examples/fonts/optimer_regular.typeface.json
        // optimer	bold	normal	../../node_modules/three/examples/fonts/optimer_bold.typeface.json
        // gentilis	normal	normal	../../node_modules/three/examples/fonts/gentilis_regular.typeface.json
        // gentilis	bold	normal	../../node_modules/three/examples/fonts/gentilis_bold.typeface.json
        // droid sans	normal	normal	../../node_modules/three/examples/fonts/droid/droid_sans_regular.typeface.json
        // droid sans	bold	normal	../../node_modules/three/examples/fonts/droid/droid_sans_bold.typeface.json
        // droid serif	normal	normal	../../node_modules/three/examples/fonts/droid/droid_serif_regular.typeface.json
        // droid serif	bold	normal	../../node_modules/three/examples/fonts/droid/droid_serif_bold.typeface.json
        loader.load('../resources/fonts/helvetiker_regular.typeface.json', (response) => {
            this.font = response;
            this.refreshText();
        });
    },
    refreshText: function () {
        this.createText(this.options.textArr,this.options.fontSize);
    },
    isPC: function(){
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }
}