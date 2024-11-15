# GKtechnology FE Level test

## 코드 흐름
### 1. 잔액 호출 및 지불금액 입력
먼저 getNowBalance로 잔액을 호출하는 api를 호출하고, 성공적으로 호출 시 데이터 타입에 맞게 세팅합니다. 잔액의 타입은 types.ts의 balanceProps으로 정의해 두었습니다.  
그런 다음 diffbalance를 이용해 현재 잔액과 입력 금액을 비교하고, 입력 금액이 잔액을 초과할 시 버튼을 disable시킵니다.  
diffbalance는 useEffect를 통해 입력 금액이 바뀔 때마다 금액을 비교합니다.  
잔액은 useEffect를 이용해 첫 렌더링 시 호출합니다.

#### 데이터 포맷팅
잔액을 표기하는데 일정 이상의 금액은 지수로 표현되어 포맷팅을 사용해 숫자로 나타나도록 설정했습니다.
```jsx
    <span>{receiveCurrency === 'Select token' ? 'token not selected' : 'Balance: ' + new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 10,
    }).format(nowBalance[payCurrency] - Number(inputBalance)) + " " + payCurrency}
    </span>
```
### 2. 통화 선택 기능 구현 및 미 선택시 select token 노출
우선 입력값 입력 후, 1번을 체크하는지, 아니면 you pay쪽은 default 통화가 설정되어있는지 알 수가 없어 스크린샷을 바탕으로 you pay는 default 통화로 CTC를 설정했습니다.  
그런 다음, modal을 통해 입력값이 바뀌기 때문에 상태 관리 라이브러리인 zustand를 이용해 pay쪽의 통화, recevie쪽의 통화 데이터를 담고 있는 store에서 각 모달에서 해당 스토어의 데이터를 수정하는 식으로 진행했습니다.  
그리고 해당 통화 데이터들의 값을 balanceProps의 키값(CTC, USDC, USDT, WCTC)로 한정했습니다.(receive는 'select token' 추가)
또한 flag 값을 props로 넘겨 어느쪽 모달인지 파악하고, 그에 해당하는 통화값을 변경하도록 했습니다.

### 3. 통화 스왑
swapCurrency 함수를 이용해 통화를 스왑하도록 했습니다.  
이때 통화가 선택되지 않았을 경우 alert 창을 출력하고 스왑하지 않습니다.

### 4. 받을 금액 표기
displayReceive 함수를 통해 통화가 선택되고, inputBalance가 0이상(금액 입력) 됐을 경우 받을 금액 표기합니다.  
api 2번을 통해 통화 가치 정보를 받아오고, 받아온 정보를 토대로 금액을 계산해 값을 receiveBalance에 세팅합니다.
useEffect를 통해 inputBalance, payCurrency, receiveCurrency 해당 요소에 변화가 감지되면 displayReceive를 호출합니다.

### 5. api 호출
callPostApi를 이용해 api 3번을 post 호출합니다. console로 잘 호출됐는지 확인합니다.
