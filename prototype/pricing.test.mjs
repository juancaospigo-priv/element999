import test from 'node:test';
import assert from 'node:assert/strict';
import {estimate} from './pricing.mjs';

test('ofertas aprobadas a 80 EUR/h y reserva del 15 %',()=>{
  for(const [input,expected] of [
    [{service:'landing'},[1600,1850]],
    [{service:'landing',language:true},[1950,2250]],
    [{service:'agent'},[3200,3700]],
    [{service:'agent',integration:true},[3850,4450]],
    [{service:'landing',urgent:true},[2000,2300]],
  ]){const result=estimate(input);assert.deepEqual([result.low,result.high],expected);}
});
test('alcance abierto y servicio a medida no generan precio automático',()=>{
  for(const input of [{service:'custom'},{service:'landing',custom:true},{service:'agent',language:true}]){const result=estimate(input);assert.equal(result.review,true);assert.equal(result.low,undefined);}
});
test('urgencia conserva el rango pero obliga a revisión; servicio inválido se rechaza',()=>{
  assert.equal(estimate({service:'landing',urgent:true}).review,true);
  assert.throws(()=>estimate({service:'arbitrary'}));
});
