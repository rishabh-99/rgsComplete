const Octokit = require('@octokit/rest')
const octokit = new Octokit({
    auth: 'token c5bf37713ee935a647da9b45653febf7e87caf30'
})

function octokitData(octokit, path) {
    console.log("enter");
     octokit.repos.createOrUpdateFile({
        owner: "robin9421",
        repo: "robin",
        path: path,
        message: 'some message here',
        content: ''
    })
        // .then(data => {
        //     console.log("files inserted gitHUb")
        // })
        // .catch(err => {
        //     // console.log(err)
        //     if (err.status === 404) {
        //         octokit.repos.createForAuthenticatedUser({
        //             name: inputData.templateName,
        //         })
        //             .then(data => {
        //                 console.log("repo created")
        //                 octokit.repos.createOrUpdateFile({
        //                     owner: "robin9421",
        //                     repo: "abc",
        //                     path: path,
        //                     message: 'some message here',
        //                     content: ''
        //                 })
        //             })
        //             .catch(error => {
        //                 console.log("repo creation failed")
        //             })
        //     }
        // })
        // console.log("done");
}




const filesData = [{
    "text": "root1",
    "nodes": []
},
{
    "text": "roooot",
    "nodes": [
        {
            "text": "abc11",
            "nodes": [
                {
                    "text": "c",
                    "nodes": []
                },
                {
                    "text": "d"
                },{
                    "text":"robin"
                }
            ]
        },
        {
            "text":"robin"
        }
    ]
}   
];


traverse(filesData, "", octokit);

    function traverse(filesData, path, octokit) {
        if (filesData !== null && typeof(filesData) == "object") {
            if (filesData.constructor === Array) {
                for (var i = 0; i < filesData.length; i++) {
                    traverse(filesData[i], path, octokit);
                }
            }
            else {
                if (filesData.hasOwnProperty('nodes') && Object.entries(filesData.nodes).length != 0) {
                    path += filesData.text + '/';
                    
                }
                else {
                    path += filesData.text;
                    console.log(path);
                    setInterval(function(){
                        octokitData(octokit,path);
                    },3000);
                    
                }
                traverse(filesData.nodes, path, octokit);
            }
        }
    else {
        return
    }
}

module.exports = {
    traverse: traverse
}