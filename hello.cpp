#include<bits/stdc++.h>
using namespace std;

int main(){
    int i = 0, j;
    while(i<2){
        j = 0;
        while(j<=3*i){
            cout<<j<<" ";
            j += 3;
        }
        cout<<endl;
        i +=1;
    }
}