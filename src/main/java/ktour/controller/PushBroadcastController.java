package ktour.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ktour.service.FirebaseMessagingService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/fcm")
@RequiredArgsConstructor
public class PushBroadcastController {

    private final FirebaseMessagingService firebaseService;

    // ✅ static 변수로 토큰 리스트 관리
    private static final Set<String> tokenList = new HashSet<>();

    /**
     * 새로운 토큰 등록 → 전체에게 알림 브로드캐스트
     * @param newToken 새로 접속한 사용자의 토큰
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerToken(@RequestParam String newToken) {
        System.out.println("새 토큰 등록 요청: " + newToken);

        // 1️⃣ 이미 등록된 토큰이면 무시
        if (tokenList.contains(newToken)) {
            return ResponseEntity.ok("이미 등록된 토큰입니다.");
        }

        // 2️⃣ 신규 토큰 저장
        tokenList.add(newToken);
        System.out.println("현재 등록된 토큰 수: " + tokenList.size());

        // 3️⃣ 전체 사용자에게 축하 알림 발송
        String title = "새로운 유저 접속";
        String body = "새로운 사용자가 알림을 활성화했습니다! (" + newToken.substring(0, 8) + "...)";

        System.out.println( tokenList );

        firebaseService.sendNotificationToAll(
                new ArrayList<>(tokenList),
                title,
                body
        );

        return ResponseEntity.ok("토큰 등록 및 축하 메시지 전송 완료");
    }

    /**
     * 현재 저장된 모든 토큰 확인용 (테스트용)
     */
    @GetMapping("/tokens")
    public ResponseEntity<?> getAllTokens() {
        return ResponseEntity.ok(tokenList);
    }

    @GetMapping("/all")
    public void getAll() {
        // 3️⃣ 전체 사용자에게 축하 알림 발송
        String title = "관리자가 보낸 메시지";
        String body = "테스트중이야.";

        System.out.println( tokenList );

        firebaseService.sendNotificationToAll(
                new ArrayList<>(tokenList),
                title,
                body
        );
    }
}
