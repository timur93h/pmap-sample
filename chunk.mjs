import chunk from 'chunk'
import pMap from 'p-map';
const data = [1,2,3,4,5,6,7,8,9,10];

const chunkedArray = chunk(data,3);

const sampleAsync = async(chunk)=>{
    console.log(chunk);
}

const dummmyRequest = function(indicator){
    console.log(' request is starting out.... ')
    const data = new Promise((resolve, reject) => {
        setTimeout(()=>{
            console.log(' request complete ',indicator)
            resolve('hey im resolved')
        },10000);
    });
    return data;
}

// try to check the difference

const test = async()=>{
    // approach number (1)
    for(const chunk of chunkedArray){
        // do some magic here...
        await sampleAsync(chunk);
    }
    console.log('============');
    
}

/*
Promise all will wait until all is resolved
if any request fails it will reject!!!
 */

const test2 = async() => {
    // approach number (1)
    const resolvers = []
    for(const chunk of chunkedArray){
        // do some magic here...
        chunk.length && resolvers.push(sampleAsync(chunk));
    }
    await Promise.all(resolvers);
    
}


/**
 * Please notice how request are processed !!!
 * one by one
 * one by one
 * It will only start processing after request is complete
 * or for example -> db will aquire a lock on the table and lock will be released after each iteration those, taking one connect at a time
 * @returns {Promise<void>}
 */
const test3 = async()=>{
    for(const chunkPeace of chunkedArray){
        // notice how they all start ...
        console.log(await dummmyRequest(chunkPeace));
    }
}

/**
 * Notice how request will be processed in here!!!!!!
 * not one by one but all fire @ the same time
 * @type {*[]}
 */

const peacesOfPromises = [];
const test4 = async()=>{
    for(const chunkPeace of chunkedArray){
        // notice how they all start ...
        peacesOfPromises.push(dummmyRequest(chunkPeace));
    }
    await Promise.all(peacesOfPromises);
}

/**
 * Pmap --> Parallel calls !!!
 * Works based on Promise all!!!
 * Returns a Promise that is fulfilled when all promises in input and ones returned from mapper are fulfilled, or rejects if any of the promises reject.
 */
const test5 = async()=>{
    await pMap(chunkedArray,dummmyRequest,{concurrency : 2})
}


// test1();
// test2();
// test3();
// test4();
// test5();



