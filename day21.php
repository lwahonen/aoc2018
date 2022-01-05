<?php
$tested=[];
$r0=0;
$r1=0;
$r2=0;
$r3=0;
$r4=0;
$r5=0;
line_5:  $r5=0;                             // seti 0 5 5
line_6:  $r2=$r5 | 65536;                   // bori 5 65536 2
line_7:  $r5=10362650;                      // seti 10362650 3 5
line_8:  $r4=$r2 & 255;                     // bani 2 255 4
line_9:  $r5=$r4 + $r5;                     // addr 5 4 5
line_10: $r5=$r5 & 16777215;                // bani 5 16777215 5
line_11: $r5=$r5 * 65899;                   // muli 5 65899 5
line_12: $r5=$r5 & 16777215;                // bani 5 16777215 5
line_13: $r4 = 256 > $r2 ? 1 : 0;           // gtir 256 2 4
line_14: if( $r4 == 1) goto line_16;        // addr 4 3 3
line_15: goto line_17;                      // addi 3 1 3
line_16: goto line_28;                      // seti 27 4 3
line_17: $r4=0;                             // seti 0 3 4
line_18: $r1=$r4 + 1;                       // addi 4 1 1
line_19: $r1=$r1 * 256;                     // muli 1 256 1
line_20: $r1 = $r1 > $r2 ? 1 : 0;           // gtrr 1 2 1
line_21: if( $r1 == 1 ) goto line_23;       // addr 1 3 3
line_22: goto line_24;                      // addi 3 1 3
line_23: goto line_26;                      // seti 25 2 3
line_24: $r4 = $r4 + 1;                     // addi 4 1 4
line_25: goto line_18;                      // seti 17 7 3
line_26: $r2=$r4;                           // setr 4 0 2
line_27: goto line_8;                       // seti 7 8 3
line_28:
if(sizeof($tested) == 0) {
    echo "\nFirst test is for $r5, so that's part 1 answer";
}
if(in_array($r5, $tested)) {
    echo "\nFirst reoccurring test found, so part 2 answer is ".end($tested);
    exit(0);
}
$tested[]=$r5;
$r4 = $r5 == $r0 ? 1 : 0;                   // eqrr 5 0 4
line_29: if( $r4 == 1 ) goto line_31;       // addr 4 3 3
line_30: goto line_6;                       // seti 5 1 3
line_31: echo "\nYou're done bud";
