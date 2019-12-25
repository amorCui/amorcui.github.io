'use strict';
function DrawText(options) {
    this._init_(options);

    this.render();
}

DrawText.prototype = {
    constructor: DrawText,
    scene: null,
    world:null,
    camera: null,
    renderer: null,
    textMeshs: [],
    cubes:[],
    ground:null,
    debug:null,
    options: {
        fontSize:0.3,
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

       
        // var lights = [];
        // lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );
        // lights[ 0 ].position.set( 0, 200, 0 );
        // lights[ 1 ].position.set( 100, 200, 100 );
        // lights[ 2 ].position.set( - 100, - 200, - 100 );
        // this.scene.add( lights[ 0 ] );
        // this.scene.add( lights[ 1 ] );
        // this.scene.add( lights[ 2 ] );

        // var ambientLight = new THREE.AmbientLight( 0x000000 );
        // this.scene.add( ambientLight );

        //renderer
        this.initRenderer();

        this.textMeshs = new THREE.Group();
        this.textMeshs.position.set(0,2,0);
        this.scene.add(this.textMeshs);

        this.createPlane();

        this.createCube();

        //辅助工具
        // this.initHelper();

        // var geometry1 = new THREE.BoxGeometry( 2, 1, 1 );
        // var material1 = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        // var cube1 = new THREE.Mesh( geometry1, material1 );
        // this.cubes.add(cube1);

        // var geometry2 = new THREE.BoxGeometry( 1, 2, 1 );
        // var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        // var cube2 = new THREE.Mesh( geometry2, material2 );
        // this.cubes.add(cube2);        



        this.fontLoad();
        // this.createText(this.options.textArr);

        this.debug = new THREE.CannonDebugRenderer(this.scene, this.world)

        this.render();
        addEventListener("resize",()=>{
            //renderer
            this.initRenderer();

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
        //  相机视角，缩放因子
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
        this.camera.position.set(0, 2, 5);
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
            for(var cube of this.cubes){
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
        var size = 0.2;
        var color = 0xCC6633;
        var offsetZ = 8;
        var cubepositions= [
            [-1 - 15 ,1/2 ,0 - offsetZ],
            [0 - 15 ,1/2 ,0 - offsetZ],
            [1 - 15 ,1/2 ,0 - offsetZ],
            [-2 - 15 ,1/2 ,1 - offsetZ],
            [-1 - 15 ,1/2 ,1 - offsetZ],
            [1 - 15 ,1/2 ,1 - offsetZ],
            [2 - 15 ,1/2 ,1 - offsetZ],
            [-3 - 15 ,1/2 ,2 - offsetZ],
            [3 - 15 ,1/2 ,2 - offsetZ],
            [-2 - 15 ,1/2 ,2 - offsetZ],
            [2 - 15 ,1/2 ,2 - offsetZ],
            [-3 - 15 ,1/2 ,3 - offsetZ],
            [-2 - 15 ,1/2 ,3 - offsetZ],
            [2 - 15 ,1/2 ,3 - offsetZ],
            [3 - 15 ,1/2 ,3 - offsetZ],
            [-3 - 15 ,1/2 ,4 - offsetZ],
            [-2 - 15 ,1/2 ,4 - offsetZ],
            [-1 - 15 ,1/2 ,4 - offsetZ],
            [0 - 15 ,1/2 ,4 - offsetZ],
            [1 - 15 ,1/2 ,4 - offsetZ],
            [2 - 15 ,1/2 ,4 - offsetZ],
            [3 - 15 ,1/2 ,4 - offsetZ],
            [-3 - 15 ,1/2 ,5 - offsetZ],
            [-2 - 15 ,1/2 ,5 - offsetZ],
            [2 - 15 ,1/2 ,5 - offsetZ],
            [3 - 15 ,1/2 ,5 - offsetZ],
            [-3 - 15 ,1/2 ,6 - offsetZ],
            [-2 - 15 ,1/2 ,6 - offsetZ],
            [2 - 15 ,1/2 ,6 - offsetZ],
            [3 - 15 ,1/2 ,6 - offsetZ],

            [-3 - 5 ,1/2 , 0 - offsetZ],
            [-2 - 5 ,1/2 , 0 - offsetZ],
            [2 - 5 ,1/2 , 0 - offsetZ],
            [3 - 5 ,1/2 , 0 - offsetZ],
            [-3 - 5 ,1/2 , 1 - offsetZ],
            [-2 - 5 ,1/2 , 1 - offsetZ],
            [-1 - 5 ,1/2 , 1 - offsetZ],
            [1 - 5 ,1/2 , 1 - offsetZ],
            [2 - 5 ,1/2 , 1 - offsetZ],
            [3 - 5 ,1/2 , 1 - offsetZ],
            [-3 - 5 ,1/2 , 2 - offsetZ],
            [-2 - 5 ,1/2 , 2 - offsetZ],
            [-1 - 5 ,1/2 , 2 - offsetZ],
            [0 - 5 ,1/2 , 2 - offsetZ],
            [1 - 5 ,1/2 , 2 - offsetZ],
            [2 - 5 ,1/2 , 2 - offsetZ],
            [3 - 5 ,1/2 , 2 - offsetZ],
            [-3 - 5 ,1/2 , 3 - offsetZ],
            [-2 - 5 ,1/2 , 3 - offsetZ],
            [0 - 5 ,1/2 , 3 - offsetZ],
            [2 - 5 ,1/2 , 3 - offsetZ],
            [3 - 5 ,1/2 , 3 - offsetZ],
            [-3 - 5 ,1/2 , 4 - offsetZ],
            [-2 - 5 ,1/2 , 4 - offsetZ],
            [2 - 5 ,1/2 , 4 - offsetZ],
            [3 - 5 ,1/2 , 4 - offsetZ],
            [-3 - 5 ,1/2 , 5 - offsetZ],
            [-2 - 5 ,1/2 , 5 - offsetZ],
            [2 - 5 ,1/2 , 5 - offsetZ],
            [3 - 5 ,1/2 , 5 - offsetZ],
            [-3 - 5 ,1/2 , 6 - offsetZ],
            [-2 - 5 ,1/2 , 6 - offsetZ],
            [2 - 5 ,1/2 , 6 - offsetZ],
            [3 - 5 ,1/2 , 6 - offsetZ],

            [-1 + 5 ,1/2 ,0 - offsetZ],
            [0 + 5 ,1/2 ,0 - offsetZ],
            [1 + 5 ,1/2 ,0 - offsetZ],
            [-2 + 5 ,1/2 ,1 - offsetZ],
            [-1 + 5 ,1/2 ,1 - offsetZ],
            [1 + 5 ,1/2 ,1 - offsetZ],
            [2 + 5 ,1/2 ,1 - offsetZ],
            [-3 + 5 ,1/2 ,2 - offsetZ],
            [-2 + 5 ,1/2 ,2 - offsetZ],
            [2 + 5 ,1/2 ,2 - offsetZ],
            [3 + 5 ,1/2 ,2 - offsetZ],
            [-3 + 5 ,1/2 ,3 - offsetZ],
            [-2 + 5 ,1/2 ,3 - offsetZ],
            [2 + 5 ,1/2 ,3 - offsetZ],
            [3 + 5 ,1/2 ,3 - offsetZ],
            [-3 + 5 ,1/2 ,4 - offsetZ],
            [-2 + 5 ,1/2 ,4 - offsetZ],
            [2 + 5 ,1/2 ,4 - offsetZ],
            [3 + 5 ,1/2 ,4 - offsetZ],
            [-2 + 5 ,1/2 ,5 - offsetZ],
            [-1 + 5 ,1/2 ,5 - offsetZ],
            [1 + 5 ,1/2 ,5 - offsetZ],
            [2 + 5 ,1/2 ,5 - offsetZ],
            [-1 + 5 ,1/2 ,6 - offsetZ],
            [0 + 5 ,1/2 ,6 - offsetZ],
            [1 + 5 ,1/2 ,6 - offsetZ],

            [-3 + 15 ,1/2 , 0 - offsetZ],
            [-2 + 15 ,1/2 , 0 - offsetZ],
            [-1 + 15 ,1/2 , 0 - offsetZ],
            [0 + 15 ,1/2 , 0 - offsetZ],
            [1 + 15 ,1/2 , 0 - offsetZ],
            [2 + 15 ,1/2 , 0 - offsetZ],
            [-3 + 15 ,1/2 , 1 - offsetZ],
            [-2 + 15 ,1/2 , 1 - offsetZ],
            [2 + 15 ,1/2 , 1 - offsetZ],
            [3 + 15 ,1/2 , 1 - offsetZ],
            [-3 + 15 ,1/2 , 2 - offsetZ],
            [-2 + 15 ,1/2 , 2 - offsetZ],
            [2 + 15 ,1/2 , 2 - offsetZ],
            [3 + 15 ,1/2 , 2 - offsetZ],
            [-3 + 15 ,1/2 , 3 - offsetZ],
            [-2 + 15 ,1/2 , 3 - offsetZ],
            [-1 + 15 ,1/2 , 3 - offsetZ],
            [0 + 15 ,1/2 , 3 - offsetZ],
            [1 + 15 ,1/2 , 3 - offsetZ],
            [2 + 15 ,1/2 , 3 - offsetZ],
            [-3 + 15 ,1/2 , 4 - offsetZ],
            [-2 + 15 ,1/2 , 4 - offsetZ],
            [0 + 15 ,1/2 , 4 - offsetZ],
            [1 + 15 ,1/2 , 4 - offsetZ],
            [-3 + 15 ,1/2 , 5 - offsetZ],
            [-2 + 15 ,1/2 , 5 - offsetZ],
            [1 + 15 ,1/2 , 5 - offsetZ],
            [2 + 15 ,1/2 , 5 - offsetZ],
            [-3 + 15 ,1/2 , 6 - offsetZ],
            [-2 + 15 ,1/2 , 6 - offsetZ],
            [2 + 15 ,1/2 , 6 - offsetZ],
            [3 + 15 ,1/2 , 6 - offsetZ],
        ];

        for(var pos of cubepositions){
            ////物理
            var shape = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2 , size / 2)); // 形状
            var shapeMaterial = new CANNON.Material();  // 材质
            var shapeBody = new CANNON.Body({ // 刚体
                mass: 5,    //质量
                material: shapeMaterial,
                shape:shape
            });
            shapeBody.position.set(size * pos[0],size * pos[1], size * pos[2]);



            this.world.add(shapeBody);

            var sphere_ground = new CANNON.ContactMaterial(this.ground.physics.material, shapeMaterial, { //  定义两个刚体相遇后会发生什么
                friction: 1,    // 摩擦系数
                restitution: 0.4    // 恢复系数
            })
            this.world.addContactMaterial(sphere_ground) // 添加到世界中

            //////
            var geometry = new THREE.CubeGeometry(size,size,size);
            //一种非发光材料
            var material = new THREE.MeshLambertMaterial({ color: color });
            var cube = new THREE.Mesh(geometry, material);
            //告诉立方体需要投射阴影
            cube.castShadow = true;
            cube.position.set(size * pos[0],size * pos[1], size * pos[2]);

            this.cubes.push({
                shape:cube,
                physics:shapeBody
            });
            
            this.scene.add(cube);
        }

   
    },
    createPlane:function(){
        //底部物理平面
        var groundShape = new CANNON.Plane();   // 形状
        var groundMaterial = new CANNON.Material(); // 材质
        var groundBody = new CANNON.Body({  // 刚体
            mass: 0,    // 质量，质量为0时为静态刚体
            shape: groundShape,
            material: groundMaterial 
        })
        // setFromAxisAngle 旋转 X 轴 -90 度
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)

        this.world.add(groundBody)


        ////底部平面
        var planeGeometry = new THREE.PlaneGeometry(1000,1000);
        var planeMaterial = new THREE.MeshStandardMaterial({color:0xaaaaaa});

        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.set(-Math.PI / 2,0,0);
        plane.position.set(0,0,0);

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

        var materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
        ];
        var that = this;
        textOptions.map(function ({ text, parameters }, index, array) {
            var textGeo;
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
            var textMesh = new THREE.Mesh(textGeo, materials);
            textMesh.position.x = (index - 2) * fontSize;
            textMesh.castShadow = true;
            that.textMeshs.add(textMesh);
        });
        // for( {text,parameters} of textOptions){
        //     var textGeo;
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
        //     var textMesh = new THREE.Mesh( textGeo, materials );

        //     this.textMeshs.add(textMesh);
        // }
    },
    fontLoad: function () {
        var loader = new THREE.FontLoader();

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
    }
}