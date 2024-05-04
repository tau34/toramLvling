const magn_par = [11, 11, 11, 11, 11, 11, 10, 9, 7, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, .99, .98, .97, 
    .96, .95, .94, .93, .92, .91, .90, .88, .86, .84, .82, .80, .78, .76, .74, .72, .70, .67, .64, 
    .61, .58, .55, .52, .49, .46, .43, .40, .36, .32, .28, .24, .20, .16, .12];
const magn_pet = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, .99, .98, .97, 
    .96, .95, .94, .93, .92, .91, .90, .88, .86, .84, .82, .80, .78, .76, .74, .72, .70, .67, .64, 
    .61, .58, .55, .52, .49, .46, .43, .40, .36, .32, .28, .24, .20, .16, .12];
var data;

fetch('sample.txt').then(response => response.text())
    .then(d => {data = d;});

function getMagn(diflvl, type, isMaxFamiliar=true) {
    var flag = diflvl > 56
    if (type == 0) {
        if (flag) {
            return 0.1;
        } else {
            return magn_par[diflvl]
        }
    } else {
        var m;
        if (flag) {
            m = 0.1;
        } else {
            m = magn_pet[diflvl]
        }
        if (isMaxFamiliar) {
            return 10 * m;
        }
    }
}

function getExp(bossId) {
    var diflvl = Math.abs(data[bossId][2] - $(".own_lv")[0].value);
    var magn = getMagn(diflvl, $(".type:checked")[0].value, $(".fam")[0].value == "on")
    return Math.round(data[bossId][4] * magn);
}

function calc() {
    var result = [];
    for (var i = 0; i < data.length; i ++) {
        if (isQualified(i)) {
            result[result.length] = [i, getExp(i)]
        }
    }
    result.sort(function(a,b){return(b[1] - a[1]);});
    console.log(result)
    var numValues;
    if ($(".num_ranks")[0] == -1 || $(".num_ranks")[0] > result.length) {
        numValues = result.length;
    } else {
        numValues = $(".num_ranks")[0].value;
    }
    for (var i = 0; i < numValues; i ++) {
        var index = result[i][0];
        $("tbody").html("<tr><th>名前/マップ</th><th>難易度</th><th>レベル</th><th>経験値</th></tr>")
        $("tbody").append("<tr><td>" + data[index][0] + "<br>" + data[index][3] + "</td><td>" + 
            data[index][1] + "</td><td>" + data[index][2] + "</td><td>" + result[i][1] + "</td>")
    }
}

function isQualified(bossId) {
    var diflvl = Math.abs(data[bossId][2] - $(".own_lv")[0].value);
    if (diflvl > $(".max_dif_lv")[0].value) {
        if ($(".max_dif_lv")[0].value == -1) {
            return true;
        } else {
            return false;
        }
    }
    switch (data[bossId][1]) {
        case "Easy":
            return $(".dif_e")[0].checked;
        case "Normal":
            return $(".dif_n")[0].checked;
        case "Hard":
            return $(".dif_h")[0].checked;
        case "Lunatic":
            return $(".dif_l")[0].checked;
        case "Ultimate":
            return $(".dif_u")[0].checked;
    }
}

window.onload = function () {
    $(".type").change(function () {
        if ($(".type:checked")[0].value == "1") {
            $(".fam_container").css("display", "block")
        } else {
            $(".fam_container").css("display", "none")
        }
    });
    $(".lv_minus").click(function () {
        $(".own_lv")[0].value --;
    });
    $(".lv_plus").click(function () {
        $(".own_lv")[0].value ++;
    });
    $(".dif_minus").click(function () {
        $(".max_dif_lv")[0].value --;
    });
    $(".dif_plus").click(function () {
        $(".max_dif_lv")[0].value ++;
    });
    $(".num_minus").click(function () {
        $(".num_ranks")[0].value --;
    });
    $(".num_plus").click(function () {
        $(".num_ranks")[0].value ++;
    });
    $(".calc").click(calc);
}