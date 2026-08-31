/**
 * GENERATED FILE -- DO NOT EDIT BY HAND.
 *
 * Produced by scripts/generate-world.ts. To change the simulated world, edit
 * that script and re-run:  npm run gen:world --workspace @soc/server
 *
 * This file is committed on purpose: exercise answers depend on the exact
 * contents, so the logs must not change unless somebody intends them to.
 */

/** 2539 lines of authentication events for Aug 15. */
export const AUTH_LOG = `Aug 15 00:00:29 rmg-web-02 sshd[21426]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:00:31 rmg-web-02 sshd[21426]: Failed password for nagios from 10.20.9.40 port 40008 ssh2
Aug 15 00:05:19 rmg-web-02 sshd[21429]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:05:21 rmg-web-02 sshd[21429]: Failed password for nagios from 10.20.9.40 port 55036 ssh2
Aug 15 00:10:18 rmg-web-02 sshd[21438]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:10:20 rmg-web-02 sshd[21438]: Failed password for nagios from 10.20.9.40 port 37675 ssh2
Aug 15 00:11:21 rmg-web-02 sshd[22872]: Invalid user admin from 198.51.100.202 port 52392
Aug 15 00:11:22 rmg-web-02 sshd[22872]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:11:22 rmg-web-02 sshd[22872]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:11:24 rmg-web-02 sshd[22872]: Failed password for invalid user admin from 198.51.100.202 port 52392 ssh2
Aug 15 00:11:25 rmg-web-02 sshd[22872]: Connection closed by invalid user admin 198.51.100.202 port 52392 [preauth]
Aug 15 00:15:14 rmg-web-02 sshd[21447]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:15:16 rmg-web-02 sshd[21447]: Failed password for nagios from 10.20.9.40 port 42985 ssh2
Aug 15 00:15:51 rmg-web-02 sshd[22880]: Invalid user webmaster from 203.0.113.12 port 39904
Aug 15 00:15:52 rmg-web-02 sshd[22880]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:15:52 rmg-web-02 sshd[22880]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 00:15:54 rmg-web-02 sshd[22880]: Failed password for invalid user webmaster from 203.0.113.12 port 39904 ssh2
Aug 15 00:15:55 rmg-web-02 sshd[22880]: Connection closed by invalid user webmaster 203.0.113.12 port 39904 [preauth]
Aug 15 00:16:18 rmg-web-02 sshd[22896]: Invalid user support from 198.51.100.23 port 36431
Aug 15 00:16:19 rmg-web-02 sshd[22896]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:16:19 rmg-web-02 sshd[22896]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 00:16:21 rmg-web-02 sshd[22896]: Failed password for invalid user support from 198.51.100.23 port 36431 ssh2
Aug 15 00:16:22 rmg-web-02 sshd[22896]: Connection closed by invalid user support 198.51.100.23 port 36431 [preauth]
Aug 15 00:17:01 rmg-web-02 CRON[29736]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 00:17:01 rmg-web-02 CRON[9070]: pam_unix(cron:session): session closed for user root
Aug 15 00:20:27 rmg-web-02 sshd[21451]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:20:29 rmg-web-02 sshd[21451]: Failed password for nagios from 10.20.9.40 port 55700 ssh2
Aug 15 00:25:30 rmg-web-02 sshd[21456]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:25:32 rmg-web-02 sshd[21456]: Failed password for nagios from 10.20.9.40 port 59880 ssh2
Aug 15 00:29:45 rmg-web-02 sshd[22889]: Invalid user user from 203.0.113.140 port 46679
Aug 15 00:29:46 rmg-web-02 sshd[22889]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:29:46 rmg-web-02 sshd[22889]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 00:29:48 rmg-web-02 sshd[22889]: Failed password for invalid user user from 203.0.113.140 port 46679 ssh2
Aug 15 00:29:49 rmg-web-02 sshd[22889]: Connection closed by invalid user user 203.0.113.140 port 46679 [preauth]
Aug 15 00:30:02 rmg-web-02 sshd[21462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:30:04 rmg-web-02 sshd[21462]: Failed password for nagios from 10.20.9.40 port 37894 ssh2
Aug 15 00:35:16 rmg-web-02 sshd[21463]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:35:18 rmg-web-02 sshd[21463]: Failed password for nagios from 10.20.9.40 port 56467 ssh2
Aug 15 00:35:57 rmg-web-02 sshd[22886]: Invalid user admin from 198.51.100.202 port 51188
Aug 15 00:35:58 rmg-web-02 sshd[22886]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:35:58 rmg-web-02 sshd[22886]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:36:00 rmg-web-02 sshd[22886]: Failed password for invalid user admin from 198.51.100.202 port 51188 ssh2
Aug 15 00:36:01 rmg-web-02 sshd[22886]: Connection closed by invalid user admin 198.51.100.202 port 51188 [preauth]
Aug 15 00:40:24 rmg-web-02 sshd[21464]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:40:26 rmg-web-02 sshd[21464]: Failed password for nagios from 10.20.9.40 port 37697 ssh2
Aug 15 00:45:05 rmg-web-02 sshd[21472]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:45:07 rmg-web-02 sshd[21472]: Failed password for nagios from 10.20.9.40 port 46075 ssh2
Aug 15 00:50:22 rmg-web-02 sshd[21473]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:50:24 rmg-web-02 sshd[21473]: Failed password for nagios from 10.20.9.40 port 38517 ssh2
Aug 15 00:55:12 rmg-web-02 sshd[21475]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 00:55:14 rmg-web-02 sshd[21475]: Failed password for nagios from 10.20.9.40 port 35305 ssh2
Aug 15 00:56:56 rmg-web-02 sshd[22904]: Invalid user pi from 198.51.100.202 port 53020
Aug 15 00:56:57 rmg-web-02 sshd[22904]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 00:56:57 rmg-web-02 sshd[22904]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 00:56:59 rmg-web-02 sshd[22904]: Failed password for invalid user pi from 198.51.100.202 port 53020 ssh2
Aug 15 00:57:00 rmg-web-02 sshd[22904]: Connection closed by invalid user pi 198.51.100.202 port 53020 [preauth]
Aug 15 01:00:00 rmg-web-02 sshd[21476]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:00:02 rmg-web-02 sshd[21476]: Failed password for nagios from 10.20.9.40 port 36951 ssh2
Aug 15 01:05:21 rmg-web-02 sshd[21479]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:05:23 rmg-web-02 sshd[21479]: Failed password for nagios from 10.20.9.40 port 54013 ssh2
Aug 15 01:10:15 rmg-web-02 sshd[21487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:10:17 rmg-web-02 sshd[21487]: Failed password for nagios from 10.20.9.40 port 56992 ssh2
Aug 15 01:15:19 rmg-web-02 sshd[21496]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:15:21 rmg-web-02 sshd[21496]: Failed password for nagios from 10.20.9.40 port 49776 ssh2
Aug 15 01:17:01 rmg-web-02 CRON[23043]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 01:17:01 rmg-web-02 CRON[11876]: pam_unix(cron:session): session closed for user root
Aug 15 01:20:16 rmg-web-02 sshd[21504]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:20:18 rmg-web-02 sshd[21504]: Failed password for nagios from 10.20.9.40 port 43633 ssh2
Aug 15 01:25:21 rmg-web-02 sshd[21509]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:25:23 rmg-web-02 sshd[21509]: Failed password for nagios from 10.20.9.40 port 64111 ssh2
Aug 15 01:25:49 rmg-web-02 sshd[22920]: Invalid user jenkins from 192.0.2.171 port 32465
Aug 15 01:25:50 rmg-web-02 sshd[22920]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:25:50 rmg-web-02 sshd[22920]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 01:25:52 rmg-web-02 sshd[22920]: Failed password for invalid user jenkins from 192.0.2.171 port 32465 ssh2
Aug 15 01:25:53 rmg-web-02 sshd[22920]: Connection closed by invalid user jenkins 192.0.2.171 port 32465 [preauth]
Aug 15 01:30:16 rmg-web-02 sshd[21408]: Accepted publickey for svc-backup from 10.20.9.15 port 32732 ssh2
Aug 15 01:30:17 rmg-web-02 sshd[21408]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Aug 15 01:30:28 rmg-web-02 sshd[21510]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:30:30 rmg-web-02 sshd[21510]: Failed password for nagios from 10.20.9.40 port 60941 ssh2
Aug 15 01:34:37 rmg-web-02 sshd[21408]: pam_unix(sshd:session): session closed for user svc-backup
Aug 15 01:35:28 rmg-web-02 sshd[21511]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:35:30 rmg-web-02 sshd[21511]: Failed password for nagios from 10.20.9.40 port 52181 ssh2
Aug 15 01:40:22 rmg-web-02 sshd[21514]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:40:24 rmg-web-02 sshd[21514]: Failed password for nagios from 10.20.9.40 port 60178 ssh2
Aug 15 01:44:08 rmg-web-02 sshd[22921]: Invalid user deploy from 203.0.113.140 port 54744
Aug 15 01:44:09 rmg-web-02 sshd[22921]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:44:09 rmg-web-02 sshd[22921]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 01:44:11 rmg-web-02 sshd[22921]: Failed password for invalid user deploy from 203.0.113.140 port 54744 ssh2
Aug 15 01:44:12 rmg-web-02 sshd[22921]: Connection closed by invalid user deploy 203.0.113.140 port 54744 [preauth]
Aug 15 01:45:08 rmg-web-02 sshd[21521]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:45:10 rmg-web-02 sshd[21521]: Failed password for nagios from 10.20.9.40 port 46273 ssh2
Aug 15 01:50:22 rmg-web-02 sshd[21530]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:50:24 rmg-web-02 sshd[21530]: Failed password for nagios from 10.20.9.40 port 33936 ssh2
Aug 15 01:55:03 rmg-web-02 sshd[21533]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 01:55:05 rmg-web-02 sshd[21533]: Failed password for nagios from 10.20.9.40 port 35949 ssh2
Aug 15 01:58:44 rmg-web-02 sshd[22913]: Invalid user postgres from 192.0.2.44 port 32546
Aug 15 01:58:45 rmg-web-02 sshd[22913]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:58:45 rmg-web-02 sshd[22913]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 01:58:47 rmg-web-02 sshd[22913]: Failed password for invalid user postgres from 192.0.2.44 port 32546 ssh2
Aug 15 01:58:48 rmg-web-02 sshd[22913]: Connection closed by invalid user postgres 192.0.2.44 port 32546 [preauth]
Aug 15 01:59:54 rmg-web-02 sshd[22924]: Invalid user ftpuser from 203.0.113.201 port 48921
Aug 15 01:59:55 rmg-web-02 sshd[22924]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 01:59:55 rmg-web-02 sshd[22924]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 01:59:57 rmg-web-02 sshd[22924]: Failed password for invalid user ftpuser from 203.0.113.201 port 48921 ssh2
Aug 15 01:59:58 rmg-web-02 sshd[22924]: Connection closed by invalid user ftpuser 203.0.113.201 port 48921 [preauth]
Aug 15 02:00:19 rmg-web-02 sshd[21539]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:00:21 rmg-web-02 sshd[21539]: Failed password for nagios from 10.20.9.40 port 62756 ssh2
Aug 15 02:05:16 rmg-web-02 sshd[21546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:05:18 rmg-web-02 sshd[21546]: Failed password for nagios from 10.20.9.40 port 44635 ssh2
Aug 15 02:10:23 rmg-web-02 sshd[21551]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:10:25 rmg-web-02 sshd[21551]: Failed password for nagios from 10.20.9.40 port 63809 ssh2
Aug 15 02:14:44 rmg-web-02 sshd[22937]: Invalid user ftpuser from 192.0.2.9 port 39882
Aug 15 02:14:45 rmg-web-02 sshd[22937]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:14:45 rmg-web-02 sshd[22937]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 02:14:47 rmg-web-02 sshd[22937]: Failed password for invalid user ftpuser from 192.0.2.9 port 39882 ssh2
Aug 15 02:14:48 rmg-web-02 sshd[22937]: Connection closed by invalid user ftpuser 192.0.2.9 port 39882 [preauth]
Aug 15 02:15:12 rmg-web-02 sshd[21553]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:15:14 rmg-web-02 sshd[21553]: Failed password for nagios from 10.20.9.40 port 58412 ssh2
Aug 15 02:17:01 rmg-web-02 CRON[10662]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 02:17:01 rmg-web-02 CRON[9919]: pam_unix(cron:session): session closed for user root
Aug 15 02:17:34 rmg-web-02 sshd[22967]: Invalid user jenkins from 198.51.100.202 port 55228
Aug 15 02:17:35 rmg-web-02 sshd[22967]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:17:35 rmg-web-02 sshd[22967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 02:17:37 rmg-web-02 sshd[22967]: Failed password for invalid user jenkins from 198.51.100.202 port 55228 ssh2
Aug 15 02:17:38 rmg-web-02 sshd[22967]: Connection closed by invalid user jenkins 198.51.100.202 port 55228 [preauth]
Aug 15 02:20:11 rmg-web-02 sshd[21558]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:20:13 rmg-web-02 sshd[21558]: Failed password for nagios from 10.20.9.40 port 52294 ssh2
Aug 15 02:25:24 rmg-web-02 sshd[21563]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:25:26 rmg-web-02 sshd[21563]: Failed password for nagios from 10.20.9.40 port 59780 ssh2
Aug 15 02:30:05 rmg-web-02 sshd[21570]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:30:07 rmg-web-02 sshd[21570]: Failed password for nagios from 10.20.9.40 port 42175 ssh2
Aug 15 02:32:23 rmg-web-02 sshd[22930]: Invalid user pi from 198.51.100.23 port 56851
Aug 15 02:32:24 rmg-web-02 sshd[22930]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:32:24 rmg-web-02 sshd[22930]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 02:32:26 rmg-web-02 sshd[22930]: Failed password for invalid user pi from 198.51.100.23 port 56851 ssh2
Aug 15 02:32:27 rmg-web-02 sshd[22930]: Connection closed by invalid user pi 198.51.100.23 port 56851 [preauth]
Aug 15 02:35:20 rmg-web-02 sshd[21579]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:35:22 rmg-web-02 sshd[21579]: Failed password for nagios from 10.20.9.40 port 46251 ssh2
Aug 15 02:40:10 rmg-web-02 sshd[21583]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:40:12 rmg-web-02 sshd[21583]: Failed password for nagios from 10.20.9.40 port 37704 ssh2
Aug 15 02:45:04 rmg-web-02 sshd[21591]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:45:06 rmg-web-02 sshd[21591]: Failed password for nagios from 10.20.9.40 port 55776 ssh2
Aug 15 02:46:18 rmg-web-02 sshd[22960]: Invalid user oracle from 198.51.100.23 port 61468
Aug 15 02:46:19 rmg-web-02 sshd[22960]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:46:19 rmg-web-02 sshd[22960]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 02:46:21 rmg-web-02 sshd[22960]: Failed password for invalid user oracle from 198.51.100.23 port 61468 ssh2
Aug 15 02:46:22 rmg-web-02 sshd[22960]: Connection closed by invalid user oracle 198.51.100.23 port 61468 [preauth]
Aug 15 02:50:25 rmg-web-02 sshd[21595]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:50:27 rmg-web-02 sshd[21595]: Failed password for nagios from 10.20.9.40 port 55852 ssh2
Aug 15 02:50:41 rmg-web-02 sshd[22955]: Invalid user postgres from 198.51.100.202 port 54744
Aug 15 02:50:42 rmg-web-02 sshd[22955]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:50:42 rmg-web-02 sshd[22955]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 02:50:44 rmg-web-02 sshd[22955]: Failed password for invalid user postgres from 198.51.100.202 port 54744 ssh2
Aug 15 02:50:45 rmg-web-02 sshd[22955]: Connection closed by invalid user postgres 198.51.100.202 port 54744 [preauth]
Aug 15 02:55:00 rmg-web-02 sshd[21598]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 02:55:02 rmg-web-02 sshd[21598]: Failed password for nagios from 10.20.9.40 port 44312 ssh2
Aug 15 02:56:02 rmg-web-02 sshd[22946]: Invalid user mysql from 203.0.113.12 port 48624
Aug 15 02:56:03 rmg-web-02 sshd[22946]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 02:56:03 rmg-web-02 sshd[22946]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 02:56:05 rmg-web-02 sshd[22946]: Failed password for invalid user mysql from 203.0.113.12 port 48624 ssh2
Aug 15 02:56:06 rmg-web-02 sshd[22946]: Connection closed by invalid user mysql 203.0.113.12 port 48624 [preauth]
Aug 15 03:00:28 rmg-web-02 sshd[21599]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:00:30 rmg-web-02 sshd[21599]: Failed password for nagios from 10.20.9.40 port 44072 ssh2
Aug 15 03:05:30 rmg-web-02 sshd[21606]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:05:32 rmg-web-02 sshd[21606]: Failed password for nagios from 10.20.9.40 port 58601 ssh2
Aug 15 03:10:12 rmg-web-02 sshd[21611]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:10:14 rmg-web-02 sshd[21611]: Failed password for nagios from 10.20.9.40 port 52173 ssh2
Aug 15 03:11:27 rmg-web-02 sshd[21417]: Accepted password for rchen from 10.20.4.12 port 32074 ssh2
Aug 15 03:11:28 rmg-web-02 sshd[21417]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Aug 15 03:14:02 rmg-web-02 sudo:    rchen : TTY=pts/0 ; PWD=/home/rchen ; USER=root ; COMMAND=/usr/bin/systemctl restart postgresql
Aug 15 03:14:02 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by rchen(uid=1003)
Aug 15 03:14:09 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 03:15:11 rmg-web-02 sshd[22986]: Invalid user user from 192.0.2.44 port 58934
Aug 15 03:15:12 rmg-web-02 sshd[22986]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:15:12 rmg-web-02 sshd[22986]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 03:15:14 rmg-web-02 sshd[22986]: Failed password for invalid user user from 192.0.2.44 port 58934 ssh2
Aug 15 03:15:15 rmg-web-02 sshd[22986]: Connection closed by invalid user user 192.0.2.44 port 58934 [preauth]
Aug 15 03:15:27 rmg-web-02 sshd[21618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:15:29 rmg-web-02 sshd[21618]: Failed password for nagios from 10.20.9.40 port 41665 ssh2
Aug 15 03:17:01 rmg-web-02 CRON[14656]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 03:17:01 rmg-web-02 CRON[29362]: pam_unix(cron:session): session closed for user root
Aug 15 03:18:40 rmg-web-02 sshd[22979]: Invalid user webmaster from 192.0.2.171 port 63588
Aug 15 03:18:41 rmg-web-02 sshd[22979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:18:41 rmg-web-02 sshd[22979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 03:18:43 rmg-web-02 sshd[22979]: Failed password for invalid user webmaster from 192.0.2.171 port 63588 ssh2
Aug 15 03:18:44 rmg-web-02 sshd[22979]: Connection closed by invalid user webmaster 192.0.2.171 port 63588 [preauth]
Aug 15 03:20:08 rmg-web-02 sshd[21626]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:20:10 rmg-web-02 sshd[21626]: Failed password for nagios from 10.20.9.40 port 39316 ssh2
Aug 15 03:25:01 rmg-web-02 sshd[21627]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:25:03 rmg-web-02 sshd[21627]: Failed password for nagios from 10.20.9.40 port 60770 ssh2
Aug 15 03:30:24 rmg-web-02 sshd[22972]: Invalid user webmaster from 198.51.100.23 port 30352
Aug 15 03:30:25 rmg-web-02 sshd[22972]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:30:25 rmg-web-02 sshd[22972]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 03:30:27 rmg-web-02 sshd[22972]: Failed password for invalid user webmaster from 198.51.100.23 port 30352 ssh2
Aug 15 03:30:28 rmg-web-02 sshd[22972]: Connection closed by invalid user webmaster 198.51.100.23 port 30352 [preauth]
Aug 15 03:30:30 rmg-web-02 sshd[21629]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:30:32 rmg-web-02 sshd[21629]: Failed password for nagios from 10.20.9.40 port 46379 ssh2
Aug 15 03:32:15 rmg-web-02 sshd[22969]: Invalid user ubuntu from 203.0.113.140 port 58472
Aug 15 03:32:16 rmg-web-02 sshd[22969]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:32:16 rmg-web-02 sshd[22969]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 03:32:18 rmg-web-02 sshd[22969]: Failed password for invalid user ubuntu from 203.0.113.140 port 58472 ssh2
Aug 15 03:32:19 rmg-web-02 sshd[22969]: Connection closed by invalid user ubuntu 203.0.113.140 port 58472 [preauth]
Aug 15 03:35:25 rmg-web-02 sshd[21634]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:35:27 rmg-web-02 sshd[21634]: Failed password for nagios from 10.20.9.40 port 51426 ssh2
Aug 15 03:38:01 rmg-web-02 sshd[22995]: Invalid user webmaster from 198.51.100.202 port 60294
Aug 15 03:38:02 rmg-web-02 sshd[22995]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:38:02 rmg-web-02 sshd[22995]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 03:38:04 rmg-web-02 sshd[22995]: Failed password for invalid user webmaster from 198.51.100.202 port 60294 ssh2
Aug 15 03:38:05 rmg-web-02 sshd[22995]: Connection closed by invalid user webmaster 198.51.100.202 port 60294 [preauth]
Aug 15 03:40:28 rmg-web-02 sshd[21642]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:40:30 rmg-web-02 sshd[21642]: Failed password for nagios from 10.20.9.40 port 59182 ssh2
Aug 15 03:41:18 rmg-web-02 sshd[21417]: pam_unix(sshd:session): session closed for user rchen
Aug 15 03:45:10 rmg-web-02 sshd[21647]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:45:12 rmg-web-02 sshd[21647]: Failed password for nagios from 10.20.9.40 port 39168 ssh2
Aug 15 03:50:28 rmg-web-02 sshd[21649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:50:30 rmg-web-02 sshd[21649]: Failed password for nagios from 10.20.9.40 port 61402 ssh2
Aug 15 03:55:14 rmg-web-02 sshd[21651]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 03:55:16 rmg-web-02 sshd[21651]: Failed password for nagios from 10.20.9.40 port 31050 ssh2
Aug 15 03:57:22 rmg-web-02 sshd[22983]: Invalid user postgres from 203.0.113.201 port 31334
Aug 15 03:57:23 rmg-web-02 sshd[22983]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 03:57:23 rmg-web-02 sshd[22983]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 03:57:25 rmg-web-02 sshd[22983]: Failed password for invalid user postgres from 203.0.113.201 port 31334 ssh2
Aug 15 03:57:26 rmg-web-02 sshd[22983]: Connection closed by invalid user postgres 203.0.113.201 port 31334 [preauth]
Aug 15 04:00:28 rmg-web-02 sshd[21655]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:00:30 rmg-web-02 sshd[21655]: Failed password for nagios from 10.20.9.40 port 52064 ssh2
Aug 15 04:05:01 rmg-web-02 sshd[21657]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:05:03 rmg-web-02 sshd[21657]: Failed password for nagios from 10.20.9.40 port 35659 ssh2
Aug 15 04:08:07 rmg-web-02 sshd[23013]: Invalid user guest from 203.0.113.12 port 37855
Aug 15 04:08:08 rmg-web-02 sshd[23013]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:08:08 rmg-web-02 sshd[23013]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 04:08:10 rmg-web-02 sshd[23013]: Failed password for invalid user guest from 203.0.113.12 port 37855 ssh2
Aug 15 04:08:11 rmg-web-02 sshd[23013]: Connection closed by invalid user guest 203.0.113.12 port 37855 [preauth]
Aug 15 04:10:06 rmg-web-02 sshd[21664]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:10:08 rmg-web-02 sshd[21664]: Failed password for nagios from 10.20.9.40 port 45169 ssh2
Aug 15 04:15:06 rmg-web-02 sshd[21672]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:15:08 rmg-web-02 sshd[21672]: Failed password for nagios from 10.20.9.40 port 61978 ssh2
Aug 15 04:17:01 rmg-web-02 CRON[28258]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 04:17:01 rmg-web-02 CRON[25804]: pam_unix(cron:session): session closed for user root
Aug 15 04:20:28 rmg-web-02 sshd[21673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:20:30 rmg-web-02 sshd[21673]: Failed password for nagios from 10.20.9.40 port 30607 ssh2
Aug 15 04:25:27 rmg-web-02 sshd[21679]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:25:29 rmg-web-02 sshd[21679]: Failed password for nagios from 10.20.9.40 port 55984 ssh2
Aug 15 04:30:12 rmg-web-02 sshd[21687]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:30:14 rmg-web-02 sshd[21687]: Failed password for nagios from 10.20.9.40 port 56068 ssh2
Aug 15 04:32:44 rmg-web-02 sshd[22998]: Invalid user support from 203.0.113.12 port 31319
Aug 15 04:32:45 rmg-web-02 sshd[22998]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:32:45 rmg-web-02 sshd[22998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 04:32:47 rmg-web-02 sshd[22998]: Failed password for invalid user support from 203.0.113.12 port 31319 ssh2
Aug 15 04:32:48 rmg-web-02 sshd[22998]: Connection closed by invalid user support 203.0.113.12 port 31319 [preauth]
Aug 15 04:35:09 rmg-web-02 sshd[21693]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:35:11 rmg-web-02 sshd[21693]: Failed password for nagios from 10.20.9.40 port 44815 ssh2
Aug 15 04:38:12 rmg-web-02 sshd[23017]: Invalid user oracle from 198.51.100.202 port 48489
Aug 15 04:38:13 rmg-web-02 sshd[23017]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:38:13 rmg-web-02 sshd[23017]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 04:38:15 rmg-web-02 sshd[23017]: Failed password for invalid user oracle from 198.51.100.202 port 48489 ssh2
Aug 15 04:38:16 rmg-web-02 sshd[23017]: Connection closed by invalid user oracle 198.51.100.202 port 48489 [preauth]
Aug 15 04:40:01 rmg-web-02 sshd[21699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:40:03 rmg-web-02 sshd[21699]: Failed password for nagios from 10.20.9.40 port 44277 ssh2
Aug 15 04:45:17 rmg-web-02 sshd[21708]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:45:19 rmg-web-02 sshd[21708]: Failed password for nagios from 10.20.9.40 port 64273 ssh2
Aug 15 04:48:52 rmg-web-02 sshd[23012]: Invalid user jenkins from 192.0.2.44 port 46779
Aug 15 04:48:53 rmg-web-02 sshd[23012]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 04:48:53 rmg-web-02 sshd[23012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 04:48:55 rmg-web-02 sshd[23012]: Failed password for invalid user jenkins from 192.0.2.44 port 46779 ssh2
Aug 15 04:48:56 rmg-web-02 sshd[23012]: Connection closed by invalid user jenkins 192.0.2.44 port 46779 [preauth]
Aug 15 04:50:28 rmg-web-02 sshd[21713]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:50:30 rmg-web-02 sshd[21713]: Failed password for nagios from 10.20.9.40 port 62316 ssh2
Aug 15 04:55:06 rmg-web-02 sshd[21720]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 04:55:08 rmg-web-02 sshd[21720]: Failed password for nagios from 10.20.9.40 port 34599 ssh2
Aug 15 04:59:59 rmg-web-02 sshd[23005]: Invalid user support from 198.51.100.202 port 52875
Aug 15 05:00:00 rmg-web-02 sshd[23005]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:00:00 rmg-web-02 sshd[23005]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 05:00:01 rmg-web-02 sshd[21727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:00:02 rmg-web-02 sshd[23005]: Failed password for invalid user support from 198.51.100.202 port 52875 ssh2
Aug 15 05:00:03 rmg-web-02 sshd[21727]: Failed password for nagios from 10.20.9.40 port 47605 ssh2
Aug 15 05:00:03 rmg-web-02 sshd[23005]: Connection closed by invalid user support 198.51.100.202 port 52875 [preauth]
Aug 15 05:04:29 rmg-web-02 sshd[23052]: Invalid user guest from 192.0.2.171 port 63957
Aug 15 05:04:30 rmg-web-02 sshd[23052]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:04:30 rmg-web-02 sshd[23052]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 05:04:32 rmg-web-02 sshd[23052]: Failed password for invalid user guest from 192.0.2.171 port 63957 ssh2
Aug 15 05:04:33 rmg-web-02 sshd[23052]: Connection closed by invalid user guest 192.0.2.171 port 63957 [preauth]
Aug 15 05:05:08 rmg-web-02 sshd[23023]: Invalid user test from 203.0.113.140 port 46747
Aug 15 05:05:09 rmg-web-02 sshd[23023]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:05:09 rmg-web-02 sshd[23023]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 05:05:11 rmg-web-02 sshd[23023]: Failed password for invalid user test from 203.0.113.140 port 46747 ssh2
Aug 15 05:05:12 rmg-web-02 sshd[23023]: Connection closed by invalid user test 203.0.113.140 port 46747 [preauth]
Aug 15 05:05:27 rmg-web-02 sshd[21736]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:05:29 rmg-web-02 sshd[21736]: Failed password for nagios from 10.20.9.40 port 58563 ssh2
Aug 15 05:10:03 rmg-web-02 sshd[21744]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:10:05 rmg-web-02 sshd[21744]: Failed password for nagios from 10.20.9.40 port 56047 ssh2
Aug 15 05:11:37 rmg-web-02 sshd[23034]: Invalid user test from 192.0.2.44 port 49986
Aug 15 05:11:38 rmg-web-02 sshd[23034]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:11:38 rmg-web-02 sshd[23034]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 05:11:40 rmg-web-02 sshd[23034]: Failed password for invalid user test from 192.0.2.44 port 49986 ssh2
Aug 15 05:11:41 rmg-web-02 sshd[23034]: Connection closed by invalid user test 192.0.2.44 port 49986 [preauth]
Aug 15 05:11:55 rmg-web-02 sshd[23029]: Invalid user admin from 203.0.113.140 port 48961
Aug 15 05:11:56 rmg-web-02 sshd[23029]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:11:56 rmg-web-02 sshd[23029]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 05:11:58 rmg-web-02 sshd[23029]: Failed password for invalid user admin from 203.0.113.140 port 48961 ssh2
Aug 15 05:11:59 rmg-web-02 sshd[23029]: Connection closed by invalid user admin 203.0.113.140 port 48961 [preauth]
Aug 15 05:15:09 rmg-web-02 sshd[21747]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:15:11 rmg-web-02 sshd[21747]: Failed password for nagios from 10.20.9.40 port 55145 ssh2
Aug 15 05:17:01 rmg-web-02 CRON[26226]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 05:17:01 rmg-web-02 CRON[18287]: pam_unix(cron:session): session closed for user root
Aug 15 05:20:20 rmg-web-02 sshd[21748]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:20:22 rmg-web-02 sshd[21748]: Failed password for nagios from 10.20.9.40 port 38462 ssh2
Aug 15 05:25:19 rmg-web-02 sshd[21752]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:25:21 rmg-web-02 sshd[21752]: Failed password for nagios from 10.20.9.40 port 63004 ssh2
Aug 15 05:25:40 rmg-web-02 sshd[23048]: Invalid user test from 203.0.113.12 port 53134
Aug 15 05:25:41 rmg-web-02 sshd[23048]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:25:41 rmg-web-02 sshd[23048]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 05:25:43 rmg-web-02 sshd[23048]: Failed password for invalid user test from 203.0.113.12 port 53134 ssh2
Aug 15 05:25:44 rmg-web-02 sshd[23048]: Connection closed by invalid user test 203.0.113.12 port 53134 [preauth]
Aug 15 05:30:03 rmg-web-02 sshd[21755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:30:05 rmg-web-02 sshd[21755]: Failed password for nagios from 10.20.9.40 port 38445 ssh2
Aug 15 05:30:33 rmg-web-02 sshd[21416]: Accepted publickey for svc-backup from 10.20.9.15 port 59040 ssh2
Aug 15 05:30:34 rmg-web-02 sshd[21416]: pam_unix(sshd:session): session opened for user svc-backup(uid=1500) by (uid=0)
Aug 15 05:34:14 rmg-web-02 sshd[21416]: pam_unix(sshd:session): session closed for user svc-backup
Aug 15 05:35:13 rmg-web-02 sshd[21760]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:35:15 rmg-web-02 sshd[21760]: Failed password for nagios from 10.20.9.40 port 48623 ssh2
Aug 15 05:40:19 rmg-web-02 sshd[21766]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:40:21 rmg-web-02 sshd[21766]: Failed password for nagios from 10.20.9.40 port 30812 ssh2
Aug 15 05:43:35 rmg-web-02 sshd[23042]: Invalid user ubuntu from 198.51.100.202 port 38101
Aug 15 05:43:36 rmg-web-02 sshd[23042]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 05:43:36 rmg-web-02 sshd[23042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 05:43:38 rmg-web-02 sshd[23042]: Failed password for invalid user ubuntu from 198.51.100.202 port 38101 ssh2
Aug 15 05:43:39 rmg-web-02 sshd[23042]: Connection closed by invalid user ubuntu 198.51.100.202 port 38101 [preauth]
Aug 15 05:45:13 rmg-web-02 sshd[21769]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:45:15 rmg-web-02 sshd[21769]: Failed password for nagios from 10.20.9.40 port 54874 ssh2
Aug 15 05:50:16 rmg-web-02 sshd[21773]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:50:18 rmg-web-02 sshd[21773]: Failed password for nagios from 10.20.9.40 port 60783 ssh2
Aug 15 05:55:28 rmg-web-02 sshd[21776]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 05:55:30 rmg-web-02 sshd[21776]: Failed password for nagios from 10.20.9.40 port 38884 ssh2
Aug 15 06:00:05 rmg-web-02 sshd[21780]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:00:07 rmg-web-02 sshd[21780]: Failed password for nagios from 10.20.9.40 port 51505 ssh2
Aug 15 06:02:41 rmg-web-02 sshd[23081]: Invalid user pi from 203.0.113.12 port 31888
Aug 15 06:02:42 rmg-web-02 sshd[23081]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:02:42 rmg-web-02 sshd[23081]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 06:02:44 rmg-web-02 sshd[23081]: Failed password for invalid user pi from 203.0.113.12 port 31888 ssh2
Aug 15 06:02:45 rmg-web-02 sshd[23081]: Connection closed by invalid user pi 203.0.113.12 port 31888 [preauth]
Aug 15 06:04:52 rmg-web-02 sshd[23063]: Invalid user git from 198.51.100.202 port 52812
Aug 15 06:04:53 rmg-web-02 sshd[23063]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:04:53 rmg-web-02 sshd[23063]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 06:04:55 rmg-web-02 sshd[23063]: Failed password for invalid user git from 198.51.100.202 port 52812 ssh2
Aug 15 06:04:56 rmg-web-02 sshd[23063]: Connection closed by invalid user git 198.51.100.202 port 52812 [preauth]
Aug 15 06:05:17 rmg-web-02 sshd[21787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:05:19 rmg-web-02 sshd[21787]: Failed password for nagios from 10.20.9.40 port 56906 ssh2
Aug 15 06:10:28 rmg-web-02 sshd[21794]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:10:30 rmg-web-02 sshd[21794]: Failed password for nagios from 10.20.9.40 port 55052 ssh2
Aug 15 06:15:16 rmg-web-02 sshd[21803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:15:18 rmg-web-02 sshd[21803]: Failed password for nagios from 10.20.9.40 port 44427 ssh2
Aug 15 06:17:01 rmg-web-02 CRON[9414]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 06:17:01 rmg-web-02 CRON[24826]: pam_unix(cron:session): session closed for user root
Aug 15 06:20:05 rmg-web-02 sshd[21806]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:20:07 rmg-web-02 sshd[21806]: Failed password for nagios from 10.20.9.40 port 36842 ssh2
Aug 15 06:25:14 rmg-web-02 sshd[21812]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:25:16 rmg-web-02 sshd[21812]: Failed password for nagios from 10.20.9.40 port 62140 ssh2
Aug 15 06:29:16 rmg-web-02 sshd[23079]: Invalid user support from 198.51.100.23 port 48079
Aug 15 06:29:17 rmg-web-02 sshd[23079]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:29:17 rmg-web-02 sshd[23079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 06:29:19 rmg-web-02 sshd[23079]: Failed password for invalid user support from 198.51.100.23 port 48079 ssh2
Aug 15 06:29:20 rmg-web-02 sshd[23079]: Connection closed by invalid user support 198.51.100.23 port 48079 [preauth]
Aug 15 06:30:01 rmg-web-02 sshd[23054]: Invalid user admin from 192.0.2.44 port 59765
Aug 15 06:30:02 rmg-web-02 sshd[23054]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:30:02 rmg-web-02 sshd[23054]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 06:30:04 rmg-web-02 sshd[23054]: Failed password for invalid user admin from 192.0.2.44 port 59765 ssh2
Aug 15 06:30:05 rmg-web-02 sshd[23054]: Connection closed by invalid user admin 192.0.2.44 port 59765 [preauth]
Aug 15 06:30:14 rmg-web-02 sshd[21821]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:30:16 rmg-web-02 sshd[21821]: Failed password for nagios from 10.20.9.40 port 34705 ssh2
Aug 15 06:35:11 rmg-web-02 sshd[21830]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:35:13 rmg-web-02 sshd[21830]: Failed password for nagios from 10.20.9.40 port 44344 ssh2
Aug 15 06:40:00 rmg-web-02 sshd[21833]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:40:02 rmg-web-02 sshd[21833]: Failed password for nagios from 10.20.9.40 port 57223 ssh2
Aug 15 06:44:03 rmg-web-02 sshd[23071]: Invalid user guest from 203.0.113.201 port 30088
Aug 15 06:44:04 rmg-web-02 sshd[23071]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:44:04 rmg-web-02 sshd[23071]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 06:44:06 rmg-web-02 sshd[23071]: Failed password for invalid user guest from 203.0.113.201 port 30088 ssh2
Aug 15 06:44:07 rmg-web-02 sshd[23071]: Connection closed by invalid user guest 203.0.113.201 port 30088 [preauth]
Aug 15 06:45:12 rmg-web-02 sshd[21837]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:45:14 rmg-web-02 sshd[21837]: Failed password for nagios from 10.20.9.40 port 60004 ssh2
Aug 15 06:50:19 rmg-web-02 sshd[21842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:50:21 rmg-web-02 sshd[21842]: Failed password for nagios from 10.20.9.40 port 52887 ssh2
Aug 15 06:51:40 rmg-web-02 sshd[23078]: Invalid user jenkins from 203.0.113.201 port 64062
Aug 15 06:51:41 rmg-web-02 sshd[23078]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 06:51:41 rmg-web-02 sshd[23078]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 06:51:43 rmg-web-02 sshd[23078]: Failed password for invalid user jenkins from 203.0.113.201 port 64062 ssh2
Aug 15 06:51:44 rmg-web-02 sshd[23078]: Connection closed by invalid user jenkins 203.0.113.201 port 64062 [preauth]
Aug 15 06:55:15 rmg-web-02 sshd[21845]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 06:55:17 rmg-web-02 sshd[21845]: Failed password for nagios from 10.20.9.40 port 39431 ssh2
Aug 15 07:00:04 rmg-web-02 sshd[21854]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:00:06 rmg-web-02 sshd[21854]: Failed password for nagios from 10.20.9.40 port 62024 ssh2
Aug 15 07:05:02 rmg-web-02 sshd[21860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:05:04 rmg-web-02 sshd[21860]: Failed password for nagios from 10.20.9.40 port 48863 ssh2
Aug 15 07:10:30 rmg-web-02 sshd[21869]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:10:32 rmg-web-02 sshd[21869]: Failed password for nagios from 10.20.9.40 port 32951 ssh2
Aug 15 07:15:24 rmg-web-02 sshd[21877]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:15:26 rmg-web-02 sshd[21877]: Failed password for nagios from 10.20.9.40 port 50131 ssh2
Aug 15 07:17:01 rmg-web-02 CRON[24378]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 07:17:01 rmg-web-02 CRON[9288]: pam_unix(cron:session): session closed for user root
Aug 15 07:19:11 rmg-web-02 sshd[23095]: Invalid user ubuntu from 203.0.113.12 port 35650
Aug 15 07:19:12 rmg-web-02 sshd[23095]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:19:12 rmg-web-02 sshd[23095]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 07:19:14 rmg-web-02 sshd[23095]: Failed password for invalid user ubuntu from 203.0.113.12 port 35650 ssh2
Aug 15 07:19:15 rmg-web-02 sshd[23095]: Connection closed by invalid user ubuntu 203.0.113.12 port 35650 [preauth]
Aug 15 07:20:00 rmg-web-02 sshd[21883]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:20:02 rmg-web-02 sshd[21883]: Failed password for nagios from 10.20.9.40 port 41474 ssh2
Aug 15 07:25:10 rmg-web-02 sshd[21886]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:25:12 rmg-web-02 sshd[21886]: Failed password for nagios from 10.20.9.40 port 31756 ssh2
Aug 15 07:30:07 rmg-web-02 sshd[21888]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:30:09 rmg-web-02 sshd[21888]: Failed password for nagios from 10.20.9.40 port 52083 ssh2
Aug 15 07:35:14 rmg-web-02 sshd[23086]: Invalid user git from 192.0.2.9 port 51864
Aug 15 07:35:15 rmg-web-02 sshd[23086]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:35:15 rmg-web-02 sshd[23086]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 07:35:17 rmg-web-02 sshd[23086]: Failed password for invalid user git from 192.0.2.9 port 51864 ssh2
Aug 15 07:35:18 rmg-web-02 sshd[21893]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:35:18 rmg-web-02 sshd[23086]: Connection closed by invalid user git 192.0.2.9 port 51864 [preauth]
Aug 15 07:35:20 rmg-web-02 sshd[21893]: Failed password for nagios from 10.20.9.40 port 52656 ssh2
Aug 15 07:38:14 rmg-web-02 sshd[23531]: Accepted password for jmartel from 10.20.4.31 port 51159 ssh2
Aug 15 07:38:15 rmg-web-02 sshd[23531]: pam_unix(sshd:session): session opened for user jmartel(uid=1001) by (uid=0)
Aug 15 07:40:07 rmg-web-02 sshd[21898]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:40:09 rmg-web-02 sshd[21898]: Failed password for nagios from 10.20.9.40 port 30725 ssh2
Aug 15 07:43:50 rmg-web-02 sshd[23101]: Invalid user pi from 198.51.100.202 port 58130
Aug 15 07:43:51 rmg-web-02 sshd[23101]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:43:51 rmg-web-02 sshd[23101]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 07:43:53 rmg-web-02 sshd[23101]: Failed password for invalid user pi from 198.51.100.202 port 58130 ssh2
Aug 15 07:43:54 rmg-web-02 sshd[23101]: Connection closed by invalid user pi 198.51.100.202 port 58130 [preauth]
Aug 15 07:45:29 rmg-web-02 sshd[21907]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:45:31 rmg-web-02 sshd[21907]: Failed password for nagios from 10.20.9.40 port 58462 ssh2
Aug 15 07:49:07 rmg-web-02 sshd[23537]: Accepted password for dokafor from 10.20.4.58 port 51300 ssh2
Aug 15 07:49:08 rmg-web-02 sshd[23537]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Aug 15 07:50:10 rmg-web-02 sshd[21912]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:50:12 rmg-web-02 sshd[21912]: Failed password for nagios from 10.20.9.40 port 59249 ssh2
Aug 15 07:51:49 rmg-web-02 sshd[23105]: Invalid user test from 203.0.113.12 port 49234
Aug 15 07:51:50 rmg-web-02 sshd[23105]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 07:51:50 rmg-web-02 sshd[23105]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 07:51:52 rmg-web-02 sshd[23105]: Failed password for invalid user test from 203.0.113.12 port 49234 ssh2
Aug 15 07:51:53 rmg-web-02 sshd[23105]: Connection closed by invalid user test 203.0.113.12 port 49234 [preauth]
Aug 15 07:55:20 rmg-web-02 sshd[21916]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 07:55:22 rmg-web-02 sshd[21916]: Failed password for nagios from 10.20.9.40 port 41290 ssh2
Aug 15 08:00:01 rmg-web-02 sshd[23545]: Accepted password for rchen from 10.20.4.12 port 61773 ssh2
Aug 15 08:00:02 rmg-web-02 sshd[23545]: pam_unix(sshd:session): session opened for user rchen(uid=1003) by (uid=0)
Aug 15 08:00:07 rmg-web-02 sshd[21923]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:00:09 rmg-web-02 sshd[21923]: Failed password for nagios from 10.20.9.40 port 55179 ssh2
Aug 15 08:03:48 rmg-web-02 sshd[23120]: Invalid user webmaster from 192.0.2.9 port 37219
Aug 15 08:03:49 rmg-web-02 sshd[23120]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:03:49 rmg-web-02 sshd[23120]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 08:03:51 rmg-web-02 sshd[23120]: Failed password for invalid user webmaster from 192.0.2.9 port 37219 ssh2
Aug 15 08:03:52 rmg-web-02 sshd[23120]: Connection closed by invalid user webmaster 192.0.2.9 port 37219 [preauth]
Aug 15 08:05:24 rmg-web-02 sshd[21932]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:05:26 rmg-web-02 sshd[21932]: Failed password for nagios from 10.20.9.40 port 50433 ssh2
Aug 15 08:10:19 rmg-web-02 sshd[21937]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:10:21 rmg-web-02 sshd[21937]: Failed password for nagios from 10.20.9.40 port 64472 ssh2
Aug 15 08:15:08 rmg-web-02 sshd[21944]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:15:10 rmg-web-02 sshd[21944]: Failed password for nagios from 10.20.9.40 port 57648 ssh2
Aug 15 08:15:33 rmg-web-02 sudo:  jmartel : TTY=pts/2 ; PWD=/home/jmartel ; USER=root ; COMMAND=/usr/bin/apt-get upgrade -y
Aug 15 08:15:33 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by jmartel(uid=1001)
Aug 15 08:17:01 rmg-web-02 CRON[11969]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 08:17:01 rmg-web-02 CRON[26036]: pam_unix(cron:session): session closed for user root
Aug 15 08:20:15 rmg-web-02 sshd[21951]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:20:17 rmg-web-02 sshd[21951]: Failed password for nagios from 10.20.9.40 port 39205 ssh2
Aug 15 08:22:47 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 08:25:10 rmg-web-02 sshd[21956]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:25:12 rmg-web-02 sshd[21956]: Failed password for nagios from 10.20.9.40 port 63142 ssh2
Aug 15 08:28:06 rmg-web-02 sshd[23118]: Invalid user postgres from 203.0.113.12 port 30975
Aug 15 08:28:07 rmg-web-02 sshd[23118]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:28:07 rmg-web-02 sshd[23118]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 08:28:09 rmg-web-02 sshd[23118]: Failed password for invalid user postgres from 203.0.113.12 port 30975 ssh2
Aug 15 08:28:10 rmg-web-02 sshd[23118]: Connection closed by invalid user postgres 203.0.113.12 port 30975 [preauth]
Aug 15 08:30:02 rmg-web-02 sshd[21965]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:30:04 rmg-web-02 sshd[21965]: Failed password for nagios from 10.20.9.40 port 30968 ssh2
Aug 15 08:35:24 rmg-web-02 sshd[21967]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:35:26 rmg-web-02 sshd[21967]: Failed password for nagios from 10.20.9.40 port 64177 ssh2
Aug 15 08:40:23 rmg-web-02 sshd[21973]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:40:25 rmg-web-02 sshd[21973]: Failed password for nagios from 10.20.9.40 port 56386 ssh2
Aug 15 08:41:26 rmg-web-02 sshd[23114]: Invalid user deploy from 198.51.100.23 port 31682
Aug 15 08:41:27 rmg-web-02 sshd[23114]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 08:41:27 rmg-web-02 sshd[23114]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 08:41:29 rmg-web-02 sshd[23114]: Failed password for invalid user deploy from 198.51.100.23 port 31682 ssh2
Aug 15 08:41:30 rmg-web-02 sshd[23114]: Connection closed by invalid user deploy 198.51.100.23 port 31682 [preauth]
Aug 15 08:45:23 rmg-web-02 sshd[21978]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:45:25 rmg-web-02 sshd[21978]: Failed password for nagios from 10.20.9.40 port 64162 ssh2
Aug 15 08:50:24 rmg-web-02 sshd[21981]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:50:26 rmg-web-02 sshd[21981]: Failed password for nagios from 10.20.9.40 port 47323 ssh2
Aug 15 08:55:00 rmg-web-02 sshd[21990]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 08:55:02 rmg-web-02 sshd[21990]: Failed password for nagios from 10.20.9.40 port 36926 ssh2
Aug 15 09:00:20 rmg-web-02 sshd[21998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:00:22 rmg-web-02 sshd[21998]: Failed password for nagios from 10.20.9.40 port 50555 ssh2
Aug 15 09:02:14 rmg-web-02 sshd[23546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Aug 15 09:02:16 rmg-web-02 sshd[23546]: Failed password for dokafor from 10.20.4.58 port 47466 ssh2
Aug 15 09:02:31 rmg-web-02 sshd[23548]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.4.58  user=dokafor
Aug 15 09:02:33 rmg-web-02 sshd[23548]: Failed password for dokafor from 10.20.4.58 port 44268 ssh2
Aug 15 09:02:58 rmg-web-02 sshd[23551]: Accepted password for dokafor from 10.20.4.58 port 44719 ssh2
Aug 15 09:02:59 rmg-web-02 sshd[23551]: pam_unix(sshd:session): session opened for user dokafor(uid=1002) by (uid=0)
Aug 15 09:05:12 rmg-web-02 sshd[22007]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:05:14 rmg-web-02 sshd[22007]: Failed password for nagios from 10.20.9.40 port 56143 ssh2
Aug 15 09:05:17 rmg-web-02 sshd[23129]: Invalid user user from 192.0.2.44 port 59047
Aug 15 09:05:18 rmg-web-02 sshd[23129]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:05:18 rmg-web-02 sshd[23129]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 09:05:20 rmg-web-02 sshd[23129]: Failed password for invalid user user from 192.0.2.44 port 59047 ssh2
Aug 15 09:05:21 rmg-web-02 sshd[23129]: Connection closed by invalid user user 192.0.2.44 port 59047 [preauth]
Aug 15 09:10:08 rmg-web-02 sshd[22012]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:10:10 rmg-web-02 sshd[22012]: Failed password for nagios from 10.20.9.40 port 62464 ssh2
Aug 15 09:10:53 rmg-web-02 sshd[23144]: Invalid user ftpuser from 203.0.113.140 port 35186
Aug 15 09:10:54 rmg-web-02 sshd[23144]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:10:54 rmg-web-02 sshd[23144]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 09:10:56 rmg-web-02 sshd[23144]: Failed password for invalid user ftpuser from 203.0.113.140 port 35186 ssh2
Aug 15 09:10:57 rmg-web-02 sshd[23144]: Connection closed by invalid user ftpuser 203.0.113.140 port 35186 [preauth]
Aug 15 09:12:03 rmg-web-02 sshd[23558]: Invalid user ubuntu from 203.0.113.55 port 50152
Aug 15 09:12:04 rmg-web-02 sshd[23558]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:04 rmg-web-02 sshd[23558]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:12:06 rmg-web-02 sshd[23558]: Failed password for invalid user ubuntu from 203.0.113.55 port 50152 ssh2
Aug 15 09:12:07 rmg-web-02 sshd[23558]: Connection closed by invalid user ubuntu 203.0.113.55 port 50152 [preauth]
Aug 15 09:12:11 rmg-web-02 sshd[23562]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:12:13 rmg-web-02 sshd[23562]: Failed password for root from 203.0.113.55 port 47972 ssh2
Aug 15 09:12:21 rmg-web-02 sshd[23567]: Invalid user oracle from 203.0.113.55 port 45977
Aug 15 09:12:22 rmg-web-02 sshd[23567]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:22 rmg-web-02 sshd[23567]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:12:24 rmg-web-02 sshd[23567]: Failed password for invalid user oracle from 203.0.113.55 port 45977 ssh2
Aug 15 09:12:25 rmg-web-02 sshd[23567]: Connection closed by invalid user oracle 203.0.113.55 port 45977 [preauth]
Aug 15 09:12:32 rmg-web-02 sshd[23568]: Invalid user admin from 203.0.113.88 port 45400
Aug 15 09:12:33 rmg-web-02 sshd[23568]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:33 rmg-web-02 sshd[23568]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:12:35 rmg-web-02 sshd[23568]: Failed password for invalid user admin from 203.0.113.88 port 45400 ssh2
Aug 15 09:12:36 rmg-web-02 sshd[23568]: Connection closed by invalid user admin 203.0.113.88 port 45400 [preauth]
Aug 15 09:12:40 rmg-web-02 sshd[23577]: Invalid user admin from 203.0.113.88 port 61791
Aug 15 09:12:41 rmg-web-02 sshd[23577]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:12:41 rmg-web-02 sshd[23577]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:12:43 rmg-web-02 sshd[23577]: Failed password for invalid user admin from 203.0.113.88 port 61791 ssh2
Aug 15 09:12:44 rmg-web-02 sshd[23577]: Connection closed by invalid user admin 203.0.113.88 port 61791 [preauth]
Aug 15 09:12:45 rmg-web-02 sshd[23580]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:12:47 rmg-web-02 sshd[23580]: Failed password for postgres from 203.0.113.55 port 60889 ssh2
Aug 15 09:12:55 rmg-web-02 sshd[23588]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:12:57 rmg-web-02 sshd[23588]: Failed password for postgres from 203.0.113.55 port 55863 ssh2
Aug 15 09:13:06 rmg-web-02 sshd[23594]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:13:08 rmg-web-02 sshd[23594]: Failed password for postgres from 203.0.113.88 port 62775 ssh2
Aug 15 09:13:09 rmg-web-02 sshd[23603]: Invalid user admin from 203.0.113.55 port 53992
Aug 15 09:13:10 rmg-web-02 sshd[23603]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:10 rmg-web-02 sshd[23603]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:12 rmg-web-02 sshd[23603]: Failed password for invalid user admin from 203.0.113.55 port 53992 ssh2
Aug 15 09:13:13 rmg-web-02 sshd[23603]: Connection closed by invalid user admin 203.0.113.55 port 53992 [preauth]
Aug 15 09:13:15 rmg-web-02 sshd[23609]: Invalid user oracle from 203.0.113.55 port 63141
Aug 15 09:13:16 rmg-web-02 sshd[23609]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:16 rmg-web-02 sshd[23609]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:18 rmg-web-02 sshd[23609]: Failed password for invalid user oracle from 203.0.113.55 port 63141 ssh2
Aug 15 09:13:19 rmg-web-02 sshd[23609]: Connection closed by invalid user oracle 203.0.113.55 port 63141 [preauth]
Aug 15 09:13:20 rmg-web-02 sshd[23611]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:13:22 rmg-web-02 sshd[23611]: Failed password for postgres from 203.0.113.55 port 52252 ssh2
Aug 15 09:13:27 rmg-web-02 sshd[23614]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:13:29 rmg-web-02 sshd[23614]: Failed password for postgres from 203.0.113.55 port 57031 ssh2
Aug 15 09:13:37 rmg-web-02 sshd[23618]: Invalid user oracle from 203.0.113.55 port 53255
Aug 15 09:13:38 rmg-web-02 sshd[23618]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:38 rmg-web-02 sshd[23618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:40 rmg-web-02 sshd[23618]: Failed password for invalid user oracle from 203.0.113.55 port 53255 ssh2
Aug 15 09:13:41 rmg-web-02 sshd[23618]: Connection closed by invalid user oracle 203.0.113.55 port 53255 [preauth]
Aug 15 09:13:44 rmg-web-02 sshd[23624]: Invalid user deploy from 198.51.100.77 port 58190
Aug 15 09:13:45 rmg-web-02 sshd[23624]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:45 rmg-web-02 sshd[23624]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:13:47 rmg-web-02 sshd[23624]: Failed password for invalid user deploy from 198.51.100.77 port 58190 ssh2
Aug 15 09:13:48 rmg-web-02 sshd[23624]: Connection closed by invalid user deploy 198.51.100.77 port 58190 [preauth]
Aug 15 09:13:52 rmg-web-02 sshd[23632]: Invalid user ubuntu from 203.0.113.55 port 60899
Aug 15 09:13:53 rmg-web-02 sshd[23632]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:53 rmg-web-02 sshd[23632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:13:55 rmg-web-02 sshd[23632]: Failed password for invalid user ubuntu from 203.0.113.55 port 60899 ssh2
Aug 15 09:13:56 rmg-web-02 sshd[23632]: Connection closed by invalid user ubuntu 203.0.113.55 port 60899 [preauth]
Aug 15 09:13:57 rmg-web-02 sshd[23149]: Invalid user deploy from 203.0.113.12 port 47637
Aug 15 09:13:58 rmg-web-02 sshd[23149]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:13:58 rmg-web-02 sshd[23149]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:13:59 rmg-web-02 sshd[23633]: Invalid user deploy from 203.0.113.55 port 59884
Aug 15 09:14:00 rmg-web-02 sshd[23149]: Failed password for invalid user deploy from 203.0.113.12 port 47637 ssh2
Aug 15 09:14:00 rmg-web-02 sshd[23633]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:00 rmg-web-02 sshd[23633]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:01 rmg-web-02 sshd[23149]: Connection closed by invalid user deploy 203.0.113.12 port 47637 [preauth]
Aug 15 09:14:02 rmg-web-02 sshd[23633]: Failed password for invalid user deploy from 203.0.113.55 port 59884 ssh2
Aug 15 09:14:03 rmg-web-02 sshd[23633]: Connection closed by invalid user deploy 203.0.113.55 port 59884 [preauth]
Aug 15 09:14:08 rmg-web-02 sshd[23637]: Invalid user ubuntu from 203.0.113.55 port 52329
Aug 15 09:14:09 rmg-web-02 sshd[23637]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:09 rmg-web-02 sshd[23637]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:11 rmg-web-02 sshd[23637]: Failed password for invalid user ubuntu from 203.0.113.55 port 52329 ssh2
Aug 15 09:14:11 rmg-web-02 sshd[23642]: Invalid user git from 198.51.100.77 port 50450
Aug 15 09:14:12 rmg-web-02 sshd[23637]: Connection closed by invalid user ubuntu 203.0.113.55 port 52329 [preauth]
Aug 15 09:14:12 rmg-web-02 sshd[23642]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:12 rmg-web-02 sshd[23642]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:14 rmg-web-02 sshd[23642]: Failed password for invalid user git from 198.51.100.77 port 50450 ssh2
Aug 15 09:14:15 rmg-web-02 sshd[23642]: Connection closed by invalid user git 198.51.100.77 port 50450 [preauth]
Aug 15 09:14:20 rmg-web-02 sshd[23649]: Invalid user test from 203.0.113.55 port 33991
Aug 15 09:14:21 rmg-web-02 sshd[23649]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:21 rmg-web-02 sshd[23649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:14:23 rmg-web-02 sshd[23649]: Failed password for invalid user test from 203.0.113.55 port 33991 ssh2
Aug 15 09:14:24 rmg-web-02 sshd[23649]: Connection closed by invalid user test 203.0.113.55 port 33991 [preauth]
Aug 15 09:14:26 rmg-web-02 sshd[23654]: Invalid user admin from 198.51.100.77 port 37902
Aug 15 09:14:27 rmg-web-02 sshd[23654]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:27 rmg-web-02 sshd[23654]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:29 rmg-web-02 sshd[23654]: Failed password for invalid user admin from 198.51.100.77 port 37902 ssh2
Aug 15 09:14:30 rmg-web-02 sshd[23654]: Connection closed by invalid user admin 198.51.100.77 port 37902 [preauth]
Aug 15 09:14:30 rmg-web-02 sshd[23661]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:14:32 rmg-web-02 sshd[23661]: Failed password for postgres from 203.0.113.55 port 32449 ssh2
Aug 15 09:14:40 rmg-web-02 sshd[23670]: Invalid user git from 198.51.100.77 port 58699
Aug 15 09:14:41 rmg-web-02 sshd[23670]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:14:41 rmg-web-02 sshd[23670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:14:43 rmg-web-02 sshd[23670]: Failed password for invalid user git from 198.51.100.77 port 58699 ssh2
Aug 15 09:14:44 rmg-web-02 sshd[23670]: Connection closed by invalid user git 198.51.100.77 port 58699 [preauth]
Aug 15 09:14:50 rmg-web-02 sshd[23673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:14:52 rmg-web-02 sshd[23673]: Failed password for postgres from 203.0.113.55 port 38780 ssh2
Aug 15 09:15:01 rmg-web-02 sshd[23679]: Invalid user test from 203.0.113.12 port 36276
Aug 15 09:15:02 rmg-web-02 sshd[23679]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:02 rmg-web-02 sshd[23679]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:15:04 rmg-web-02 sshd[23679]: Failed password for invalid user test from 203.0.113.12 port 36276 ssh2
Aug 15 09:15:05 rmg-web-02 sshd[23679]: Connection closed by invalid user test 203.0.113.12 port 36276 [preauth]
Aug 15 09:15:05 rmg-web-02 sshd[23682]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:15:07 rmg-web-02 sshd[23682]: Failed password for postgres from 203.0.113.55 port 45378 ssh2
Aug 15 09:15:14 rmg-web-02 sshd[22021]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:15:14 rmg-web-02 sshd[23683]: Invalid user test from 203.0.113.55 port 31847
Aug 15 09:15:15 rmg-web-02 sshd[23683]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:15 rmg-web-02 sshd[23683]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:16 rmg-web-02 sshd[22021]: Failed password for nagios from 10.20.9.40 port 39100 ssh2
Aug 15 09:15:17 rmg-web-02 sshd[23683]: Failed password for invalid user test from 203.0.113.55 port 31847 ssh2
Aug 15 09:15:18 rmg-web-02 sshd[23683]: Connection closed by invalid user test 203.0.113.55 port 31847 [preauth]
Aug 15 09:15:20 rmg-web-02 sshd[23685]: Invalid user deploy from 198.51.100.77 port 62136
Aug 15 09:15:21 rmg-web-02 sshd[23685]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:21 rmg-web-02 sshd[23685]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:15:23 rmg-web-02 sshd[23685]: Failed password for invalid user deploy from 198.51.100.77 port 62136 ssh2
Aug 15 09:15:23 rmg-web-02 sshd[23692]: Invalid user git from 203.0.113.12 port 39232
Aug 15 09:15:24 rmg-web-02 sshd[23685]: Connection closed by invalid user deploy 198.51.100.77 port 62136 [preauth]
Aug 15 09:15:24 rmg-web-02 sshd[23692]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:24 rmg-web-02 sshd[23692]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:15:26 rmg-web-02 sshd[23692]: Failed password for invalid user git from 203.0.113.12 port 39232 ssh2
Aug 15 09:15:26 rmg-web-02 sshd[23694]: Invalid user test from 203.0.113.88 port 49285
Aug 15 09:15:27 rmg-web-02 sshd[23692]: Connection closed by invalid user git 203.0.113.12 port 39232 [preauth]
Aug 15 09:15:27 rmg-web-02 sshd[23694]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:27 rmg-web-02 sshd[23694]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:15:29 rmg-web-02 sshd[23694]: Failed password for invalid user test from 203.0.113.88 port 49285 ssh2
Aug 15 09:15:29 rmg-web-02 sshd[23699]: Invalid user test from 203.0.113.55 port 46564
Aug 15 09:15:30 rmg-web-02 sshd[23694]: Connection closed by invalid user test 203.0.113.88 port 49285 [preauth]
Aug 15 09:15:30 rmg-web-02 sshd[23699]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:30 rmg-web-02 sshd[23699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:32 rmg-web-02 sshd[23699]: Failed password for invalid user test from 203.0.113.55 port 46564 ssh2
Aug 15 09:15:33 rmg-web-02 sshd[23699]: Connection closed by invalid user test 203.0.113.55 port 46564 [preauth]
Aug 15 09:15:35 rmg-web-02 sshd[23707]: Invalid user test from 203.0.113.55 port 55490
Aug 15 09:15:36 rmg-web-02 sshd[23707]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:36 rmg-web-02 sshd[23707]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:38 rmg-web-02 sshd[23707]: Failed password for invalid user test from 203.0.113.55 port 55490 ssh2
Aug 15 09:15:39 rmg-web-02 sshd[23707]: Connection closed by invalid user test 203.0.113.55 port 55490 [preauth]
Aug 15 09:15:42 rmg-web-02 sshd[23715]: Invalid user deploy from 203.0.113.55 port 34459
Aug 15 09:15:43 rmg-web-02 sshd[23715]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:43 rmg-web-02 sshd[23715]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:15:45 rmg-web-02 sshd[23715]: Failed password for invalid user deploy from 203.0.113.55 port 34459 ssh2
Aug 15 09:15:46 rmg-web-02 sshd[23715]: Connection closed by invalid user deploy 203.0.113.55 port 34459 [preauth]
Aug 15 09:15:49 rmg-web-02 sshd[23723]: Invalid user oracle from 203.0.113.88 port 31573
Aug 15 09:15:50 rmg-web-02 sshd[23723]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:15:50 rmg-web-02 sshd[23723]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:15:52 rmg-web-02 sshd[23723]: Failed password for invalid user oracle from 203.0.113.88 port 31573 ssh2
Aug 15 09:15:53 rmg-web-02 sshd[23723]: Connection closed by invalid user oracle 203.0.113.88 port 31573 [preauth]
Aug 15 09:15:59 rmg-web-02 sshd[23727]: Invalid user oracle from 203.0.113.88 port 45269
Aug 15 09:16:00 rmg-web-02 sshd[23727]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:00 rmg-web-02 sshd[23727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:02 rmg-web-02 sshd[23727]: Failed password for invalid user oracle from 203.0.113.88 port 45269 ssh2
Aug 15 09:16:02 rmg-web-02 sshd[23732]: Invalid user ubuntu from 203.0.113.88 port 34852
Aug 15 09:16:03 rmg-web-02 sshd[23727]: Connection closed by invalid user oracle 203.0.113.88 port 45269 [preauth]
Aug 15 09:16:03 rmg-web-02 sshd[23732]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:03 rmg-web-02 sshd[23732]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:05 rmg-web-02 sshd[23732]: Failed password for invalid user ubuntu from 203.0.113.88 port 34852 ssh2
Aug 15 09:16:05 rmg-web-02 sshd[23733]: Invalid user admin from 203.0.113.55 port 48212
Aug 15 09:16:06 rmg-web-02 sshd[23732]: Connection closed by invalid user ubuntu 203.0.113.88 port 34852 [preauth]
Aug 15 09:16:06 rmg-web-02 sshd[23733]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:06 rmg-web-02 sshd[23733]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:08 rmg-web-02 sshd[23733]: Failed password for invalid user admin from 203.0.113.55 port 48212 ssh2
Aug 15 09:16:09 rmg-web-02 sshd[23733]: Connection closed by invalid user admin 203.0.113.55 port 48212 [preauth]
Aug 15 09:16:09 rmg-web-02 sshd[23737]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:16:11 rmg-web-02 sshd[23737]: Failed password for testuser from 203.0.113.12 port 30199 ssh2
Aug 15 09:16:15 rmg-web-02 sshd[23746]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:16:17 rmg-web-02 sshd[23746]: Failed password for testuser from 203.0.113.12 port 35201 ssh2
Aug 15 09:16:24 rmg-web-02 sshd[23754]: Invalid user admin from 203.0.113.88 port 35915
Aug 15 09:16:25 rmg-web-02 sshd[23754]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:25 rmg-web-02 sshd[23754]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:16:27 rmg-web-02 sshd[23754]: Failed password for invalid user admin from 203.0.113.88 port 35915 ssh2
Aug 15 09:16:28 rmg-web-02 sshd[23754]: Connection closed by invalid user admin 203.0.113.88 port 35915 [preauth]
Aug 15 09:16:29 rmg-web-02 sshd[23757]: Invalid user git from 203.0.113.55 port 33817
Aug 15 09:16:30 rmg-web-02 sshd[23757]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:30 rmg-web-02 sshd[23757]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:32 rmg-web-02 sshd[23757]: Failed password for invalid user git from 203.0.113.55 port 33817 ssh2
Aug 15 09:16:33 rmg-web-02 sshd[23757]: Connection closed by invalid user git 203.0.113.55 port 33817 [preauth]
Aug 15 09:16:37 rmg-web-02 sshd[23759]: Invalid user admin from 203.0.113.55 port 64457
Aug 15 09:16:38 rmg-web-02 sshd[23759]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:38 rmg-web-02 sshd[23759]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:40 rmg-web-02 sshd[23759]: Failed password for invalid user admin from 203.0.113.55 port 64457 ssh2
Aug 15 09:16:41 rmg-web-02 sshd[23759]: Connection closed by invalid user admin 203.0.113.55 port 64457 [preauth]
Aug 15 09:16:42 rmg-web-02 sshd[23763]: Invalid user test from 203.0.113.55 port 64496
Aug 15 09:16:43 rmg-web-02 sshd[23763]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:16:43 rmg-web-02 sshd[23763]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:16:45 rmg-web-02 sshd[23763]: Failed password for invalid user test from 203.0.113.55 port 64496 ssh2
Aug 15 09:16:46 rmg-web-02 sshd[23763]: Connection closed by invalid user test 203.0.113.55 port 64496 [preauth]
Aug 15 09:16:46 rmg-web-02 sshd[23768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:16:48 rmg-web-02 sshd[23768]: Failed password for root from 203.0.113.55 port 64366 ssh2
Aug 15 09:16:52 rmg-web-02 sshd[23776]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:16:54 rmg-web-02 sshd[23776]: Failed password for postgres from 203.0.113.55 port 35091 ssh2
Aug 15 09:16:58 rmg-web-02 sshd[23780]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:17:00 rmg-web-02 sshd[23780]: Failed password for postgres from 203.0.113.55 port 36852 ssh2
Aug 15 09:17:01 rmg-web-02 CRON[18609]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 09:17:01 rmg-web-02 CRON[20389]: pam_unix(cron:session): session closed for user root
Aug 15 09:17:09 rmg-web-02 sshd[23783]: Invalid user deploy from 203.0.113.55 port 60502
Aug 15 09:17:10 rmg-web-02 sshd[23783]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:10 rmg-web-02 sshd[23783]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:12 rmg-web-02 sshd[23783]: Failed password for invalid user deploy from 203.0.113.55 port 60502 ssh2
Aug 15 09:17:13 rmg-web-02 sshd[23783]: Connection closed by invalid user deploy 203.0.113.55 port 60502 [preauth]
Aug 15 09:17:16 rmg-web-02 sshd[23787]: Invalid user git from 203.0.113.55 port 61450
Aug 15 09:17:17 rmg-web-02 sshd[23787]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:17 rmg-web-02 sshd[23787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:19 rmg-web-02 sshd[23787]: Failed password for invalid user git from 203.0.113.55 port 61450 ssh2
Aug 15 09:17:20 rmg-web-02 sshd[23787]: Connection closed by invalid user git 203.0.113.55 port 61450 [preauth]
Aug 15 09:17:21 rmg-web-02 sshd[23794]: Invalid user git from 203.0.113.12 port 31227
Aug 15 09:17:22 rmg-web-02 sshd[23794]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:22 rmg-web-02 sshd[23794]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:17:24 rmg-web-02 sshd[23794]: Failed password for invalid user git from 203.0.113.12 port 31227 ssh2
Aug 15 09:17:25 rmg-web-02 sshd[23794]: Connection closed by invalid user git 203.0.113.12 port 31227 [preauth]
Aug 15 09:17:27 rmg-web-02 sshd[23800]: Invalid user oracle from 203.0.113.55 port 50472
Aug 15 09:17:28 rmg-web-02 sshd[23800]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:28 rmg-web-02 sshd[23800]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:30 rmg-web-02 sshd[23800]: Failed password for invalid user oracle from 203.0.113.55 port 50472 ssh2
Aug 15 09:17:31 rmg-web-02 sshd[23800]: Connection closed by invalid user oracle 203.0.113.55 port 50472 [preauth]
Aug 15 09:17:31 rmg-web-02 sshd[23808]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:17:33 rmg-web-02 sshd[23808]: Failed password for testuser from 203.0.113.12 port 50244 ssh2
Aug 15 09:17:39 rmg-web-02 sshd[23815]: Invalid user oracle from 203.0.113.55 port 51302
Aug 15 09:17:40 rmg-web-02 sshd[23815]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:40 rmg-web-02 sshd[23815]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:42 rmg-web-02 sshd[23815]: Failed password for invalid user oracle from 203.0.113.55 port 51302 ssh2
Aug 15 09:17:43 rmg-web-02 sshd[23815]: Connection closed by invalid user oracle 203.0.113.55 port 51302 [preauth]
Aug 15 09:17:46 rmg-web-02 sshd[23822]: Invalid user oracle from 203.0.113.55 port 61706
Aug 15 09:17:47 rmg-web-02 sshd[23822]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:47 rmg-web-02 sshd[23822]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:49 rmg-web-02 sshd[23822]: Failed password for invalid user oracle from 203.0.113.55 port 61706 ssh2
Aug 15 09:17:50 rmg-web-02 sshd[23822]: Connection closed by invalid user oracle 203.0.113.55 port 61706 [preauth]
Aug 15 09:17:52 rmg-web-02 sshd[23828]: Invalid user deploy from 203.0.113.55 port 58995
Aug 15 09:17:53 rmg-web-02 sshd[23828]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:17:53 rmg-web-02 sshd[23828]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:17:55 rmg-web-02 sshd[23828]: Failed password for invalid user deploy from 203.0.113.55 port 58995 ssh2
Aug 15 09:17:56 rmg-web-02 sshd[23828]: Connection closed by invalid user deploy 203.0.113.55 port 58995 [preauth]
Aug 15 09:17:56 rmg-web-02 sshd[23833]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:17:58 rmg-web-02 sshd[23833]: Failed password for testuser from 198.51.100.77 port 40186 ssh2
Aug 15 09:18:01 rmg-web-02 sshd[23840]: Invalid user ubuntu from 203.0.113.55 port 41503
Aug 15 09:18:02 rmg-web-02 sshd[23840]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:02 rmg-web-02 sshd[23840]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:04 rmg-web-02 sshd[23840]: Failed password for invalid user ubuntu from 203.0.113.55 port 41503 ssh2
Aug 15 09:18:05 rmg-web-02 sshd[23840]: Connection closed by invalid user ubuntu 203.0.113.55 port 41503 [preauth]
Aug 15 09:18:12 rmg-web-02 sshd[23841]: Invalid user git from 203.0.113.88 port 60532
Aug 15 09:18:13 rmg-web-02 sshd[23841]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:13 rmg-web-02 sshd[23841]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:18:15 rmg-web-02 sshd[23841]: Failed password for invalid user git from 203.0.113.88 port 60532 ssh2
Aug 15 09:18:16 rmg-web-02 sshd[23841]: Connection closed by invalid user git 203.0.113.88 port 60532 [preauth]
Aug 15 09:18:22 rmg-web-02 sshd[23843]: Invalid user deploy from 203.0.113.55 port 46447
Aug 15 09:18:23 rmg-web-02 sshd[23843]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:23 rmg-web-02 sshd[23843]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:25 rmg-web-02 sshd[23843]: Failed password for invalid user deploy from 203.0.113.55 port 46447 ssh2
Aug 15 09:18:26 rmg-web-02 sshd[23843]: Connection closed by invalid user deploy 203.0.113.55 port 46447 [preauth]
Aug 15 09:18:30 rmg-web-02 sshd[23846]: Invalid user git from 203.0.113.55 port 50006
Aug 15 09:18:31 rmg-web-02 sshd[23846]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:31 rmg-web-02 sshd[23846]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:33 rmg-web-02 sshd[23846]: Failed password for invalid user git from 203.0.113.55 port 50006 ssh2
Aug 15 09:18:34 rmg-web-02 sshd[23846]: Connection closed by invalid user git 203.0.113.55 port 50006 [preauth]
Aug 15 09:18:41 rmg-web-02 sshd[23847]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:18:43 rmg-web-02 sshd[23847]: Failed password for postgres from 203.0.113.12 port 63946 ssh2
Aug 15 09:18:52 rmg-web-02 sshd[23856]: Invalid user test from 203.0.113.55 port 36235
Aug 15 09:18:53 rmg-web-02 sshd[23856]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:18:53 rmg-web-02 sshd[23856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:18:55 rmg-web-02 sshd[23856]: Failed password for invalid user test from 203.0.113.55 port 36235 ssh2
Aug 15 09:18:56 rmg-web-02 sshd[23856]: Connection closed by invalid user test 203.0.113.55 port 36235 [preauth]
Aug 15 09:19:01 rmg-web-02 sshd[23860]: Invalid user git from 198.51.100.77 port 50774
Aug 15 09:19:02 rmg-web-02 sshd[23860]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:02 rmg-web-02 sshd[23860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:19:04 rmg-web-02 sshd[23860]: Failed password for invalid user git from 198.51.100.77 port 50774 ssh2
Aug 15 09:19:05 rmg-web-02 sshd[23860]: Connection closed by invalid user git 198.51.100.77 port 50774 [preauth]
Aug 15 09:19:12 rmg-web-02 sshd[23863]: Invalid user oracle from 203.0.113.55 port 37659
Aug 15 09:19:13 rmg-web-02 sshd[23863]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:13 rmg-web-02 sshd[23863]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:15 rmg-web-02 sshd[23863]: Failed password for invalid user oracle from 203.0.113.55 port 37659 ssh2
Aug 15 09:19:16 rmg-web-02 sshd[23863]: Connection closed by invalid user oracle 203.0.113.55 port 37659 [preauth]
Aug 15 09:19:16 rmg-web-02 sshd[23868]: Invalid user git from 203.0.113.55 port 42473
Aug 15 09:19:17 rmg-web-02 sshd[23868]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:17 rmg-web-02 sshd[23868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:19 rmg-web-02 sshd[23868]: Failed password for invalid user git from 203.0.113.55 port 42473 ssh2
Aug 15 09:19:20 rmg-web-02 sshd[23868]: Connection closed by invalid user git 203.0.113.55 port 42473 [preauth]
Aug 15 09:19:21 rmg-web-02 sshd[23871]: Invalid user ubuntu from 203.0.113.12 port 62382
Aug 15 09:19:22 rmg-web-02 sshd[23871]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:22 rmg-web-02 sshd[23871]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:19:24 rmg-web-02 sshd[23871]: Failed password for invalid user ubuntu from 203.0.113.12 port 62382 ssh2
Aug 15 09:19:25 rmg-web-02 sshd[23871]: Connection closed by invalid user ubuntu 203.0.113.12 port 62382 [preauth]
Aug 15 09:19:27 rmg-web-02 sshd[23880]: Invalid user deploy from 203.0.113.55 port 37670
Aug 15 09:19:28 rmg-web-02 sshd[23880]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:28 rmg-web-02 sshd[23880]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:30 rmg-web-02 sshd[23880]: Failed password for invalid user deploy from 203.0.113.55 port 37670 ssh2
Aug 15 09:19:31 rmg-web-02 sshd[23880]: Connection closed by invalid user deploy 203.0.113.55 port 37670 [preauth]
Aug 15 09:19:31 rmg-web-02 sshd[23885]: Invalid user git from 203.0.113.55 port 42389
Aug 15 09:19:32 rmg-web-02 sshd[23885]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:19:32 rmg-web-02 sshd[23885]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:19:34 rmg-web-02 sshd[23885]: Failed password for invalid user git from 203.0.113.55 port 42389 ssh2
Aug 15 09:19:35 rmg-web-02 sshd[23885]: Connection closed by invalid user git 203.0.113.55 port 42389 [preauth]
Aug 15 09:19:39 rmg-web-02 sshd[23894]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:19:41 rmg-web-02 sshd[23894]: Failed password for postgres from 203.0.113.12 port 50030 ssh2
Aug 15 09:19:44 rmg-web-02 sshd[23895]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:19:46 rmg-web-02 sshd[23895]: Failed password for postgres from 198.51.100.77 port 48981 ssh2
Aug 15 09:19:50 rmg-web-02 sshd[23898]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:19:52 rmg-web-02 sshd[23898]: Failed password for postgres from 203.0.113.55 port 46731 ssh2
Aug 15 09:19:56 rmg-web-02 sshd[23901]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:19:58 rmg-web-02 sshd[23901]: Failed password for root from 203.0.113.12 port 59971 ssh2
Aug 15 09:20:02 rmg-web-02 sshd[23906]: Invalid user ubuntu from 203.0.113.55 port 43132
Aug 15 09:20:03 rmg-web-02 sshd[23906]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:03 rmg-web-02 sshd[23906]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:05 rmg-web-02 sshd[23906]: Failed password for invalid user ubuntu from 203.0.113.55 port 43132 ssh2
Aug 15 09:20:05 rmg-web-02 sshd[23914]: Invalid user test from 203.0.113.55 port 63357
Aug 15 09:20:06 rmg-web-02 sshd[23906]: Connection closed by invalid user ubuntu 203.0.113.55 port 43132 [preauth]
Aug 15 09:20:06 rmg-web-02 sshd[23914]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:06 rmg-web-02 sshd[23914]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:08 rmg-web-02 sshd[23914]: Failed password for invalid user test from 203.0.113.55 port 63357 ssh2
Aug 15 09:20:09 rmg-web-02 sshd[23914]: Connection closed by invalid user test 203.0.113.55 port 63357 [preauth]
Aug 15 09:20:11 rmg-web-02 sshd[23917]: Invalid user oracle from 203.0.113.55 port 47298
Aug 15 09:20:12 rmg-web-02 sshd[23917]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:12 rmg-web-02 sshd[23917]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:14 rmg-web-02 sshd[23917]: Failed password for invalid user oracle from 203.0.113.55 port 47298 ssh2
Aug 15 09:20:15 rmg-web-02 sshd[23917]: Connection closed by invalid user oracle 203.0.113.55 port 47298 [preauth]
Aug 15 09:20:16 rmg-web-02 sshd[23920]: Invalid user test from 203.0.113.55 port 52523
Aug 15 09:20:17 rmg-web-02 sshd[23920]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:17 rmg-web-02 sshd[23920]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:19 rmg-web-02 sshd[23920]: Failed password for invalid user test from 203.0.113.55 port 52523 ssh2
Aug 15 09:20:20 rmg-web-02 sshd[23920]: Connection closed by invalid user test 203.0.113.55 port 52523 [preauth]
Aug 15 09:20:23 rmg-web-02 sshd[22030]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:20:23 rmg-web-02 sshd[23925]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:20:25 rmg-web-02 sshd[22030]: Failed password for nagios from 10.20.9.40 port 35016 ssh2
Aug 15 09:20:25 rmg-web-02 sshd[23925]: Failed password for testuser from 203.0.113.12 port 47613 ssh2
Aug 15 09:20:31 rmg-web-02 sshd[23930]: Invalid user test from 198.51.100.77 port 45976
Aug 15 09:20:32 rmg-web-02 sshd[23930]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:32 rmg-web-02 sshd[23930]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:20:34 rmg-web-02 sshd[23930]: Failed password for invalid user test from 198.51.100.77 port 45976 ssh2
Aug 15 09:20:35 rmg-web-02 sshd[23930]: Connection closed by invalid user test 198.51.100.77 port 45976 [preauth]
Aug 15 09:20:35 rmg-web-02 sshd[23936]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:20:37 rmg-web-02 sshd[23936]: Failed password for root from 203.0.113.12 port 62153 ssh2
Aug 15 09:20:43 rmg-web-02 sshd[23945]: Invalid user test from 203.0.113.88 port 50930
Aug 15 09:20:44 rmg-web-02 sshd[23945]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:44 rmg-web-02 sshd[23945]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:20:46 rmg-web-02 sshd[23945]: Failed password for invalid user test from 203.0.113.88 port 50930 ssh2
Aug 15 09:20:47 rmg-web-02 sshd[23945]: Connection closed by invalid user test 203.0.113.88 port 50930 [preauth]
Aug 15 09:20:47 rmg-web-02 sshd[23950]: Invalid user deploy from 203.0.113.55 port 30430
Aug 15 09:20:48 rmg-web-02 sshd[23950]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:20:48 rmg-web-02 sshd[23950]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:20:50 rmg-web-02 sshd[23950]: Failed password for invalid user deploy from 203.0.113.55 port 30430 ssh2
Aug 15 09:20:51 rmg-web-02 sshd[23950]: Connection closed by invalid user deploy 203.0.113.55 port 30430 [preauth]
Aug 15 09:20:56 rmg-web-02 sshd[23958]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:20:58 rmg-web-02 sshd[23958]: Failed password for postgres from 198.51.100.77 port 43790 ssh2
Aug 15 09:21:02 rmg-web-02 sshd[23961]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:21:04 rmg-web-02 sshd[23961]: Failed password for postgres from 203.0.113.88 port 35883 ssh2
Aug 15 09:21:07 rmg-web-02 sshd[23962]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:09 rmg-web-02 sshd[23962]: Failed password for postgres from 203.0.113.55 port 51541 ssh2
Aug 15 09:21:11 rmg-web-02 sshd[23966]: Invalid user oracle from 198.51.100.77 port 61546
Aug 15 09:21:12 rmg-web-02 sshd[23966]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:12 rmg-web-02 sshd[23966]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:21:14 rmg-web-02 sshd[23966]: Failed password for invalid user oracle from 198.51.100.77 port 61546 ssh2
Aug 15 09:21:15 rmg-web-02 sshd[23966]: Connection closed by invalid user oracle 198.51.100.77 port 61546 [preauth]
Aug 15 09:21:20 rmg-web-02 sshd[23970]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:22 rmg-web-02 sshd[23970]: Failed password for postgres from 203.0.113.55 port 55707 ssh2
Aug 15 09:21:24 rmg-web-02 sshd[23979]: Invalid user test from 203.0.113.12 port 53977
Aug 15 09:21:25 rmg-web-02 sshd[23979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:25 rmg-web-02 sshd[23979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:21:27 rmg-web-02 sshd[23979]: Failed password for invalid user test from 203.0.113.12 port 53977 ssh2
Aug 15 09:21:28 rmg-web-02 sshd[23979]: Connection closed by invalid user test 203.0.113.12 port 53977 [preauth]
Aug 15 09:21:31 rmg-web-02 sshd[23985]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:21:33 rmg-web-02 sshd[23985]: Failed password for postgres from 203.0.113.55 port 38321 ssh2
Aug 15 09:21:39 rmg-web-02 sshd[23988]: Invalid user admin from 203.0.113.55 port 35306
Aug 15 09:21:40 rmg-web-02 sshd[23988]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:40 rmg-web-02 sshd[23988]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:21:42 rmg-web-02 sshd[23988]: Failed password for invalid user admin from 203.0.113.55 port 35306 ssh2
Aug 15 09:21:43 rmg-web-02 sshd[23988]: Connection closed by invalid user admin 203.0.113.55 port 35306 [preauth]
Aug 15 09:21:50 rmg-web-02 sshd[23994]: Invalid user admin from 203.0.113.55 port 54787
Aug 15 09:21:51 rmg-web-02 sshd[23994]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:21:51 rmg-web-02 sshd[23994]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:21:53 rmg-web-02 sshd[23994]: Failed password for invalid user admin from 203.0.113.55 port 54787 ssh2
Aug 15 09:21:54 rmg-web-02 sshd[23994]: Connection closed by invalid user admin 203.0.113.55 port 54787 [preauth]
Aug 15 09:21:58 rmg-web-02 sshd[23995]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:22:00 rmg-web-02 sshd[23995]: Failed password for testuser from 203.0.113.55 port 38767 ssh2
Aug 15 09:22:03 rmg-web-02 sshd[24002]: Invalid user git from 203.0.113.88 port 37033
Aug 15 09:22:04 rmg-web-02 sshd[24002]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:04 rmg-web-02 sshd[24002]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:22:06 rmg-web-02 sshd[24002]: Failed password for invalid user git from 203.0.113.88 port 37033 ssh2
Aug 15 09:22:07 rmg-web-02 sshd[24002]: Connection closed by invalid user git 203.0.113.88 port 37033 [preauth]
Aug 15 09:22:09 rmg-web-02 sshd[24010]: Invalid user admin from 203.0.113.55 port 55190
Aug 15 09:22:10 rmg-web-02 sshd[24010]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:10 rmg-web-02 sshd[24010]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:12 rmg-web-02 sshd[24010]: Failed password for invalid user admin from 203.0.113.55 port 55190 ssh2
Aug 15 09:22:13 rmg-web-02 sshd[24010]: Connection closed by invalid user admin 203.0.113.55 port 55190 [preauth]
Aug 15 09:22:18 rmg-web-02 sshd[24014]: Invalid user git from 198.51.100.77 port 64526
Aug 15 09:22:19 rmg-web-02 sshd[24014]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:19 rmg-web-02 sshd[24014]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:22:21 rmg-web-02 sshd[24014]: Failed password for invalid user git from 198.51.100.77 port 64526 ssh2
Aug 15 09:22:21 rmg-web-02 sshd[24019]: Invalid user oracle from 203.0.113.55 port 64609
Aug 15 09:22:22 rmg-web-02 sshd[24014]: Connection closed by invalid user git 198.51.100.77 port 64526 [preauth]
Aug 15 09:22:22 rmg-web-02 sshd[24019]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:22 rmg-web-02 sshd[24019]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:24 rmg-web-02 sshd[24019]: Failed password for invalid user oracle from 203.0.113.55 port 64609 ssh2
Aug 15 09:22:25 rmg-web-02 sshd[24019]: Connection closed by invalid user oracle 203.0.113.55 port 64609 [preauth]
Aug 15 09:22:25 rmg-web-02 sshd[24027]: Invalid user test from 203.0.113.12 port 64697
Aug 15 09:22:26 rmg-web-02 sshd[24027]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:26 rmg-web-02 sshd[24027]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:22:28 rmg-web-02 sshd[24027]: Failed password for invalid user test from 203.0.113.12 port 64697 ssh2
Aug 15 09:22:29 rmg-web-02 sshd[24027]: Connection closed by invalid user test 203.0.113.12 port 64697 [preauth]
Aug 15 09:22:31 rmg-web-02 sshd[24028]: Invalid user test from 203.0.113.55 port 33771
Aug 15 09:22:32 rmg-web-02 sshd[24028]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:32 rmg-web-02 sshd[24028]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:34 rmg-web-02 sshd[24028]: Failed password for invalid user test from 203.0.113.55 port 33771 ssh2
Aug 15 09:22:35 rmg-web-02 sshd[24028]: Connection closed by invalid user test 203.0.113.55 port 33771 [preauth]
Aug 15 09:22:40 rmg-web-02 sshd[24033]: Invalid user deploy from 203.0.113.55 port 30679
Aug 15 09:22:41 rmg-web-02 sshd[24033]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:41 rmg-web-02 sshd[24033]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:43 rmg-web-02 sshd[24033]: Failed password for invalid user deploy from 203.0.113.55 port 30679 ssh2
Aug 15 09:22:44 rmg-web-02 sshd[24033]: Connection closed by invalid user deploy 203.0.113.55 port 30679 [preauth]
Aug 15 09:22:44 rmg-web-02 sshd[24039]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:22:46 rmg-web-02 sshd[24039]: Failed password for root from 203.0.113.55 port 42146 ssh2
Aug 15 09:22:49 rmg-web-02 sshd[24042]: Invalid user git from 203.0.113.55 port 45402
Aug 15 09:22:50 rmg-web-02 sshd[24042]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:50 rmg-web-02 sshd[24042]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:22:52 rmg-web-02 sshd[24042]: Failed password for invalid user git from 203.0.113.55 port 45402 ssh2
Aug 15 09:22:53 rmg-web-02 sshd[24042]: Connection closed by invalid user git 203.0.113.55 port 45402 [preauth]
Aug 15 09:22:57 rmg-web-02 sshd[24047]: Invalid user oracle from 203.0.113.55 port 52965
Aug 15 09:22:58 rmg-web-02 sshd[24047]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:22:58 rmg-web-02 sshd[24047]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:00 rmg-web-02 sshd[24047]: Failed password for invalid user oracle from 203.0.113.55 port 52965 ssh2
Aug 15 09:23:01 rmg-web-02 sshd[24047]: Connection closed by invalid user oracle 203.0.113.55 port 52965 [preauth]
Aug 15 09:23:07 rmg-web-02 sshd[24053]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:23:09 rmg-web-02 sshd[24053]: Failed password for postgres from 203.0.113.55 port 36716 ssh2
Aug 15 09:23:12 rmg-web-02 sshd[24062]: Invalid user git from 203.0.113.55 port 32147
Aug 15 09:23:13 rmg-web-02 sshd[24062]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:13 rmg-web-02 sshd[24062]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:15 rmg-web-02 sshd[24062]: Failed password for invalid user git from 203.0.113.55 port 32147 ssh2
Aug 15 09:23:16 rmg-web-02 sshd[24062]: Connection closed by invalid user git 203.0.113.55 port 32147 [preauth]
Aug 15 09:23:22 rmg-web-02 sshd[24065]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:23:24 rmg-web-02 sshd[24065]: Failed password for testuser from 203.0.113.12 port 42700 ssh2
Aug 15 09:23:26 rmg-web-02 sshd[24067]: Invalid user oracle from 203.0.113.55 port 45516
Aug 15 09:23:27 rmg-web-02 sshd[24067]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:27 rmg-web-02 sshd[24067]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:29 rmg-web-02 sshd[24067]: Failed password for invalid user oracle from 203.0.113.55 port 45516 ssh2
Aug 15 09:23:30 rmg-web-02 sshd[24067]: Connection closed by invalid user oracle 203.0.113.55 port 45516 [preauth]
Aug 15 09:23:34 rmg-web-02 sshd[24068]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:23:36 rmg-web-02 sshd[24068]: Failed password for postgres from 203.0.113.55 port 34281 ssh2
Aug 15 09:23:45 rmg-web-02 sshd[24074]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=postgres
Aug 15 09:23:47 rmg-web-02 sshd[24074]: Failed password for postgres from 203.0.113.88 port 60841 ssh2
Aug 15 09:23:51 rmg-web-02 sshd[24080]: Invalid user oracle from 203.0.113.55 port 59130
Aug 15 09:23:52 rmg-web-02 sshd[24080]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:23:52 rmg-web-02 sshd[24080]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:23:54 rmg-web-02 sshd[24080]: Failed password for invalid user oracle from 203.0.113.55 port 59130 ssh2
Aug 15 09:23:55 rmg-web-02 sshd[24080]: Connection closed by invalid user oracle 203.0.113.55 port 59130 [preauth]
Aug 15 09:24:01 rmg-web-02 sshd[24083]: Invalid user ubuntu from 203.0.113.12 port 34565
Aug 15 09:24:02 rmg-web-02 sshd[24083]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:02 rmg-web-02 sshd[24083]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:24:04 rmg-web-02 sshd[24083]: Failed password for invalid user ubuntu from 203.0.113.12 port 34565 ssh2
Aug 15 09:24:05 rmg-web-02 sshd[24083]: Connection closed by invalid user ubuntu 203.0.113.12 port 34565 [preauth]
Aug 15 09:24:10 rmg-web-02 sshd[24085]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:24:12 rmg-web-02 sshd[24085]: Failed password for root from 203.0.113.88 port 46677 ssh2
Aug 15 09:24:18 rmg-web-02 sshd[24093]: Invalid user admin from 198.51.100.77 port 46623
Aug 15 09:24:19 rmg-web-02 sshd[24093]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:19 rmg-web-02 sshd[24093]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:24:21 rmg-web-02 sshd[24093]: Failed password for invalid user admin from 198.51.100.77 port 46623 ssh2
Aug 15 09:24:22 rmg-web-02 sshd[24093]: Connection closed by invalid user admin 198.51.100.77 port 46623 [preauth]
Aug 15 09:24:24 rmg-web-02 sshd[24096]: Invalid user test from 203.0.113.55 port 32947
Aug 15 09:24:25 rmg-web-02 sshd[24096]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:25 rmg-web-02 sshd[24096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:27 rmg-web-02 sshd[24096]: Failed password for invalid user test from 203.0.113.55 port 32947 ssh2
Aug 15 09:24:28 rmg-web-02 sshd[24096]: Connection closed by invalid user test 203.0.113.55 port 32947 [preauth]
Aug 15 09:24:30 rmg-web-02 sshd[24098]: Invalid user test from 203.0.113.55 port 33468
Aug 15 09:24:31 rmg-web-02 sshd[24098]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:31 rmg-web-02 sshd[24098]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:33 rmg-web-02 sshd[24098]: Failed password for invalid user test from 203.0.113.55 port 33468 ssh2
Aug 15 09:24:34 rmg-web-02 sshd[24098]: Connection closed by invalid user test 203.0.113.55 port 33468 [preauth]
Aug 15 09:24:38 rmg-web-02 sshd[24100]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:24:40 rmg-web-02 sshd[24100]: Failed password for root from 203.0.113.55 port 39996 ssh2
Aug 15 09:24:42 rmg-web-02 sshd[24104]: Invalid user ubuntu from 203.0.113.55 port 38015
Aug 15 09:24:43 rmg-web-02 sshd[24104]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:43 rmg-web-02 sshd[24104]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:45 rmg-web-02 sshd[24104]: Failed password for invalid user ubuntu from 203.0.113.55 port 38015 ssh2
Aug 15 09:24:46 rmg-web-02 sshd[24104]: Connection closed by invalid user ubuntu 203.0.113.55 port 38015 [preauth]
Aug 15 09:24:49 rmg-web-02 sshd[24106]: Invalid user admin from 203.0.113.55 port 45050
Aug 15 09:24:50 rmg-web-02 sshd[24106]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:50 rmg-web-02 sshd[24106]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:24:52 rmg-web-02 sshd[24106]: Failed password for invalid user admin from 203.0.113.55 port 45050 ssh2
Aug 15 09:24:52 rmg-web-02 sshd[24115]: Invalid user oracle from 198.51.100.77 port 62180
Aug 15 09:24:53 rmg-web-02 sshd[24106]: Connection closed by invalid user admin 203.0.113.55 port 45050 [preauth]
Aug 15 09:24:53 rmg-web-02 sshd[24115]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:53 rmg-web-02 sshd[24115]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:24:55 rmg-web-02 sshd[24115]: Failed password for invalid user oracle from 198.51.100.77 port 62180 ssh2
Aug 15 09:24:56 rmg-web-02 sshd[24115]: Connection closed by invalid user oracle 198.51.100.77 port 62180 [preauth]
Aug 15 09:24:57 rmg-web-02 sshd[24121]: Invalid user ubuntu from 203.0.113.55 port 31641
Aug 15 09:24:58 rmg-web-02 sshd[24121]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:24:58 rmg-web-02 sshd[24121]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:00 rmg-web-02 sshd[24121]: Failed password for invalid user ubuntu from 203.0.113.55 port 31641 ssh2
Aug 15 09:25:01 rmg-web-02 sshd[24121]: Connection closed by invalid user ubuntu 203.0.113.55 port 31641 [preauth]
Aug 15 09:25:07 rmg-web-02 sshd[24124]: Invalid user test from 203.0.113.55 port 48426
Aug 15 09:25:08 rmg-web-02 sshd[24124]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:08 rmg-web-02 sshd[24124]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:10 rmg-web-02 sshd[22037]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:25:10 rmg-web-02 sshd[24124]: Failed password for invalid user test from 203.0.113.55 port 48426 ssh2
Aug 15 09:25:11 rmg-web-02 sshd[24124]: Connection closed by invalid user test 203.0.113.55 port 48426 [preauth]
Aug 15 09:25:12 rmg-web-02 sshd[22037]: Failed password for nagios from 10.20.9.40 port 50563 ssh2
Aug 15 09:25:12 rmg-web-02 sshd[24131]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:25:14 rmg-web-02 sshd[24131]: Failed password for postgres from 203.0.113.55 port 57150 ssh2
Aug 15 09:25:23 rmg-web-02 sshd[24135]: Invalid user git from 203.0.113.55 port 57426
Aug 15 09:25:24 rmg-web-02 sshd[24135]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:24 rmg-web-02 sshd[24135]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:26 rmg-web-02 sshd[24135]: Failed password for invalid user git from 203.0.113.55 port 57426 ssh2
Aug 15 09:25:27 rmg-web-02 sshd[24135]: Connection closed by invalid user git 203.0.113.55 port 57426 [preauth]
Aug 15 09:25:29 rmg-web-02 sshd[24144]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:25:31 rmg-web-02 sshd[24144]: Failed password for root from 203.0.113.55 port 57927 ssh2
Aug 15 09:25:39 rmg-web-02 sshd[24153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:25:41 rmg-web-02 sshd[24153]: Failed password for testuser from 203.0.113.55 port 47631 ssh2
Aug 15 09:25:47 rmg-web-02 sshd[24162]: Invalid user deploy from 198.51.100.77 port 60578
Aug 15 09:25:48 rmg-web-02 sshd[24162]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:48 rmg-web-02 sshd[24162]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:25:50 rmg-web-02 sshd[24162]: Failed password for invalid user deploy from 198.51.100.77 port 60578 ssh2
Aug 15 09:25:51 rmg-web-02 sshd[24162]: Connection closed by invalid user deploy 198.51.100.77 port 60578 [preauth]
Aug 15 09:25:54 rmg-web-02 sshd[24164]: Invalid user oracle from 203.0.113.55 port 53940
Aug 15 09:25:55 rmg-web-02 sshd[24164]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:55 rmg-web-02 sshd[24164]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:25:57 rmg-web-02 sshd[24164]: Failed password for invalid user oracle from 203.0.113.55 port 53940 ssh2
Aug 15 09:25:58 rmg-web-02 sshd[24164]: Connection closed by invalid user oracle 203.0.113.55 port 53940 [preauth]
Aug 15 09:25:58 rmg-web-02 sshd[24166]: Invalid user deploy from 203.0.113.55 port 46604
Aug 15 09:25:59 rmg-web-02 sshd[24166]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:25:59 rmg-web-02 sshd[24166]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:26:01 rmg-web-02 sshd[24166]: Failed password for invalid user deploy from 203.0.113.55 port 46604 ssh2
Aug 15 09:26:01 rmg-web-02 sshd[24173]: Invalid user ubuntu from 203.0.113.12 port 45190
Aug 15 09:26:02 rmg-web-02 sshd[24166]: Connection closed by invalid user deploy 203.0.113.55 port 46604 [preauth]
Aug 15 09:26:02 rmg-web-02 sshd[24173]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:02 rmg-web-02 sshd[24173]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:04 rmg-web-02 sshd[24173]: Failed password for invalid user ubuntu from 203.0.113.12 port 45190 ssh2
Aug 15 09:26:05 rmg-web-02 sshd[24173]: Connection closed by invalid user ubuntu 203.0.113.12 port 45190 [preauth]
Aug 15 09:26:05 rmg-web-02 sshd[24174]: Invalid user oracle from 203.0.113.12 port 55066
Aug 15 09:26:06 rmg-web-02 sshd[24174]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:06 rmg-web-02 sshd[24174]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:08 rmg-web-02 sshd[24174]: Failed password for invalid user oracle from 203.0.113.12 port 55066 ssh2
Aug 15 09:26:09 rmg-web-02 sshd[24174]: Connection closed by invalid user oracle 203.0.113.12 port 55066 [preauth]
Aug 15 09:26:15 rmg-web-02 sshd[24178]: Invalid user ubuntu from 203.0.113.55 port 48446
Aug 15 09:26:16 rmg-web-02 sshd[24178]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:16 rmg-web-02 sshd[24178]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:26:18 rmg-web-02 sshd[24178]: Failed password for invalid user ubuntu from 203.0.113.55 port 48446 ssh2
Aug 15 09:26:19 rmg-web-02 sshd[24178]: Connection closed by invalid user ubuntu 203.0.113.55 port 48446 [preauth]
Aug 15 09:26:26 rmg-web-02 sshd[24185]: Invalid user ubuntu from 203.0.113.88 port 34508
Aug 15 09:26:27 rmg-web-02 sshd[24185]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:27 rmg-web-02 sshd[24185]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:29 rmg-web-02 sshd[24185]: Failed password for invalid user ubuntu from 203.0.113.88 port 34508 ssh2
Aug 15 09:26:29 rmg-web-02 sshd[24187]: Invalid user deploy from 203.0.113.12 port 42629
Aug 15 09:26:30 rmg-web-02 sshd[24185]: Connection closed by invalid user ubuntu 203.0.113.88 port 34508 [preauth]
Aug 15 09:26:30 rmg-web-02 sshd[24187]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:30 rmg-web-02 sshd[24187]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:26:32 rmg-web-02 sshd[24187]: Failed password for invalid user deploy from 203.0.113.12 port 42629 ssh2
Aug 15 09:26:33 rmg-web-02 sshd[24187]: Connection closed by invalid user deploy 203.0.113.12 port 42629 [preauth]
Aug 15 09:26:38 rmg-web-02 sshd[24188]: Invalid user ubuntu from 203.0.113.88 port 48690
Aug 15 09:26:39 rmg-web-02 sshd[24188]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:39 rmg-web-02 sshd[24188]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:41 rmg-web-02 sshd[24188]: Failed password for invalid user ubuntu from 203.0.113.88 port 48690 ssh2
Aug 15 09:26:42 rmg-web-02 sshd[24188]: Connection closed by invalid user ubuntu 203.0.113.88 port 48690 [preauth]
Aug 15 09:26:43 rmg-web-02 sshd[24191]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:26:45 rmg-web-02 sshd[24191]: Failed password for postgres from 203.0.113.55 port 35362 ssh2
Aug 15 09:26:46 rmg-web-02 sshd[24199]: Invalid user git from 203.0.113.88 port 60593
Aug 15 09:26:47 rmg-web-02 sshd[24199]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:26:47 rmg-web-02 sshd[24199]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:26:49 rmg-web-02 sshd[24199]: Failed password for invalid user git from 203.0.113.88 port 60593 ssh2
Aug 15 09:26:50 rmg-web-02 sshd[24199]: Connection closed by invalid user git 203.0.113.88 port 60593 [preauth]
Aug 15 09:26:51 rmg-web-02 sshd[24203]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:26:53 rmg-web-02 sshd[24203]: Failed password for postgres from 203.0.113.55 port 56766 ssh2
Aug 15 09:27:02 rmg-web-02 sshd[24210]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:27:04 rmg-web-02 sshd[24210]: Failed password for postgres from 203.0.113.55 port 46689 ssh2
Aug 15 09:27:09 rmg-web-02 sshd[24217]: Invalid user admin from 203.0.113.55 port 60363
Aug 15 09:27:10 rmg-web-02 sshd[24217]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:10 rmg-web-02 sshd[24217]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:12 rmg-web-02 sshd[24217]: Failed password for invalid user admin from 203.0.113.55 port 60363 ssh2
Aug 15 09:27:13 rmg-web-02 sshd[24217]: Connection closed by invalid user admin 203.0.113.55 port 60363 [preauth]
Aug 15 09:27:14 rmg-web-02 sshd[24222]: Invalid user admin from 203.0.113.55 port 38061
Aug 15 09:27:15 rmg-web-02 sshd[24222]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:15 rmg-web-02 sshd[24222]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:17 rmg-web-02 sshd[24222]: Failed password for invalid user admin from 203.0.113.55 port 38061 ssh2
Aug 15 09:27:18 rmg-web-02 sshd[24222]: Connection closed by invalid user admin 203.0.113.55 port 38061 [preauth]
Aug 15 09:27:21 rmg-web-02 sshd[24230]: Invalid user test from 203.0.113.55 port 53864
Aug 15 09:27:22 rmg-web-02 sshd[24230]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:22 rmg-web-02 sshd[24230]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:24 rmg-web-02 sshd[24230]: Failed password for invalid user test from 203.0.113.55 port 53864 ssh2
Aug 15 09:27:25 rmg-web-02 sshd[24230]: Connection closed by invalid user test 203.0.113.55 port 53864 [preauth]
Aug 15 09:27:27 rmg-web-02 sshd[24239]: Invalid user test from 203.0.113.55 port 33454
Aug 15 09:27:28 rmg-web-02 sshd[24239]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:28 rmg-web-02 sshd[24239]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:30 rmg-web-02 sshd[24239]: Failed password for invalid user test from 203.0.113.55 port 33454 ssh2
Aug 15 09:27:31 rmg-web-02 sshd[24239]: Connection closed by invalid user test 203.0.113.55 port 33454 [preauth]
Aug 15 09:27:37 rmg-web-02 sshd[24245]: Invalid user admin from 203.0.113.55 port 40271
Aug 15 09:27:38 rmg-web-02 sshd[24245]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:38 rmg-web-02 sshd[24245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:40 rmg-web-02 sshd[24245]: Failed password for invalid user admin from 203.0.113.55 port 40271 ssh2
Aug 15 09:27:41 rmg-web-02 sshd[24245]: Connection closed by invalid user admin 203.0.113.55 port 40271 [preauth]
Aug 15 09:27:45 rmg-web-02 sshd[24248]: Invalid user admin from 203.0.113.12 port 47547
Aug 15 09:27:46 rmg-web-02 sshd[24248]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:46 rmg-web-02 sshd[24248]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:27:48 rmg-web-02 sshd[24248]: Failed password for invalid user admin from 203.0.113.12 port 47547 ssh2
Aug 15 09:27:49 rmg-web-02 sshd[24248]: Connection closed by invalid user admin 203.0.113.12 port 47547 [preauth]
Aug 15 09:27:51 rmg-web-02 sshd[24251]: Invalid user oracle from 203.0.113.55 port 42883
Aug 15 09:27:52 rmg-web-02 sshd[24251]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:27:52 rmg-web-02 sshd[24251]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:27:54 rmg-web-02 sshd[24251]: Failed password for invalid user oracle from 203.0.113.55 port 42883 ssh2
Aug 15 09:27:55 rmg-web-02 sshd[24251]: Connection closed by invalid user oracle 203.0.113.55 port 42883 [preauth]
Aug 15 09:28:02 rmg-web-02 sshd[24257]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:28:04 rmg-web-02 sshd[24257]: Failed password for testuser from 203.0.113.55 port 63323 ssh2
Aug 15 09:28:07 rmg-web-02 sshd[24258]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:28:09 rmg-web-02 sshd[24258]: Failed password for root from 203.0.113.55 port 37093 ssh2
Aug 15 09:28:13 rmg-web-02 sshd[24263]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:28:15 rmg-web-02 sshd[24263]: Failed password for postgres from 203.0.113.55 port 44308 ssh2
Aug 15 09:28:23 rmg-web-02 sshd[24265]: Invalid user deploy from 203.0.113.55 port 63516
Aug 15 09:28:24 rmg-web-02 sshd[24265]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:24 rmg-web-02 sshd[24265]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:26 rmg-web-02 sshd[24265]: Failed password for invalid user deploy from 203.0.113.55 port 63516 ssh2
Aug 15 09:28:27 rmg-web-02 sshd[24265]: Connection closed by invalid user deploy 203.0.113.55 port 63516 [preauth]
Aug 15 09:28:30 rmg-web-02 sshd[24271]: Invalid user deploy from 203.0.113.55 port 64950
Aug 15 09:28:31 rmg-web-02 sshd[24271]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:31 rmg-web-02 sshd[24271]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:33 rmg-web-02 sshd[24271]: Failed password for invalid user deploy from 203.0.113.55 port 64950 ssh2
Aug 15 09:28:34 rmg-web-02 sshd[24271]: Connection closed by invalid user deploy 203.0.113.55 port 64950 [preauth]
Aug 15 09:28:39 rmg-web-02 sshd[24275]: Invalid user test from 203.0.113.55 port 57822
Aug 15 09:28:40 rmg-web-02 sshd[24275]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:40 rmg-web-02 sshd[24275]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:42 rmg-web-02 sshd[24275]: Failed password for invalid user test from 203.0.113.55 port 57822 ssh2
Aug 15 09:28:43 rmg-web-02 sshd[24275]: Connection closed by invalid user test 203.0.113.55 port 57822 [preauth]
Aug 15 09:28:44 rmg-web-02 sshd[24284]: Invalid user deploy from 203.0.113.55 port 59634
Aug 15 09:28:45 rmg-web-02 sshd[24284]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:28:45 rmg-web-02 sshd[24284]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:28:47 rmg-web-02 sshd[24284]: Failed password for invalid user deploy from 203.0.113.55 port 59634 ssh2
Aug 15 09:28:48 rmg-web-02 sshd[24284]: Connection closed by invalid user deploy 203.0.113.55 port 59634 [preauth]
Aug 15 09:28:54 rmg-web-02 sshd[24290]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:28:56 rmg-web-02 sshd[24290]: Failed password for testuser from 203.0.113.55 port 38372 ssh2
Aug 15 09:29:05 rmg-web-02 sshd[24293]: Invalid user test from 198.51.100.77 port 45603
Aug 15 09:29:06 rmg-web-02 sshd[24293]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:06 rmg-web-02 sshd[24293]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:29:08 rmg-web-02 sshd[24293]: Failed password for invalid user test from 198.51.100.77 port 45603 ssh2
Aug 15 09:29:09 rmg-web-02 sshd[24293]: Connection closed by invalid user test 198.51.100.77 port 45603 [preauth]
Aug 15 09:29:13 rmg-web-02 sshd[24301]: Invalid user git from 203.0.113.55 port 39629
Aug 15 09:29:14 rmg-web-02 sshd[24301]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:14 rmg-web-02 sshd[24301]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:16 rmg-web-02 sshd[24301]: Failed password for invalid user git from 203.0.113.55 port 39629 ssh2
Aug 15 09:29:17 rmg-web-02 sshd[24301]: Connection closed by invalid user git 203.0.113.55 port 39629 [preauth]
Aug 15 09:29:22 rmg-web-02 sshd[24302]: Invalid user deploy from 203.0.113.55 port 36245
Aug 15 09:29:23 rmg-web-02 sshd[24302]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:23 rmg-web-02 sshd[24302]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:25 rmg-web-02 sshd[24302]: Failed password for invalid user deploy from 203.0.113.55 port 36245 ssh2
Aug 15 09:29:26 rmg-web-02 sshd[24302]: Connection closed by invalid user deploy 203.0.113.55 port 36245 [preauth]
Aug 15 09:29:26 rmg-web-02 sshd[24305]: Invalid user git from 203.0.113.55 port 60877
Aug 15 09:29:27 rmg-web-02 sshd[24305]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:27 rmg-web-02 sshd[24305]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:29 rmg-web-02 sshd[24305]: Failed password for invalid user git from 203.0.113.55 port 60877 ssh2
Aug 15 09:29:30 rmg-web-02 sshd[24305]: Connection closed by invalid user git 203.0.113.55 port 60877 [preauth]
Aug 15 09:29:36 rmg-web-02 sshd[24306]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:29:38 rmg-web-02 sshd[24306]: Failed password for postgres from 203.0.113.55 port 30456 ssh2
Aug 15 09:29:42 rmg-web-02 sshd[24307]: Invalid user ubuntu from 203.0.113.55 port 36133
Aug 15 09:29:43 rmg-web-02 sshd[24307]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:43 rmg-web-02 sshd[24307]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:45 rmg-web-02 sshd[24307]: Failed password for invalid user ubuntu from 203.0.113.55 port 36133 ssh2
Aug 15 09:29:45 rmg-web-02 sshd[24314]: Invalid user deploy from 203.0.113.55 port 43917
Aug 15 09:29:46 rmg-web-02 sshd[24307]: Connection closed by invalid user ubuntu 203.0.113.55 port 36133 [preauth]
Aug 15 09:29:46 rmg-web-02 sshd[24314]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:46 rmg-web-02 sshd[24314]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:48 rmg-web-02 sshd[24314]: Failed password for invalid user deploy from 203.0.113.55 port 43917 ssh2
Aug 15 09:29:49 rmg-web-02 sshd[24314]: Connection closed by invalid user deploy 203.0.113.55 port 43917 [preauth]
Aug 15 09:29:49 rmg-web-02 sshd[24319]: Invalid user test from 203.0.113.55 port 41443
Aug 15 09:29:50 rmg-web-02 sshd[24319]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:29:50 rmg-web-02 sshd[24319]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:29:52 rmg-web-02 sshd[24319]: Failed password for invalid user test from 203.0.113.55 port 41443 ssh2
Aug 15 09:29:53 rmg-web-02 sshd[24319]: Connection closed by invalid user test 203.0.113.55 port 41443 [preauth]
Aug 15 09:30:00 rmg-web-02 sshd[24323]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:30:02 rmg-web-02 sshd[24323]: Failed password for testuser from 203.0.113.55 port 40182 ssh2
Aug 15 09:30:05 rmg-web-02 sshd[22039]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:30:07 rmg-web-02 sshd[22039]: Failed password for nagios from 10.20.9.40 port 44213 ssh2
Aug 15 09:30:07 rmg-web-02 sshd[24324]: Invalid user ubuntu from 203.0.113.55 port 32589
Aug 15 09:30:08 rmg-web-02 sshd[24324]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:08 rmg-web-02 sshd[24324]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:10 rmg-web-02 sshd[24324]: Failed password for invalid user ubuntu from 203.0.113.55 port 32589 ssh2
Aug 15 09:30:10 rmg-web-02 sshd[24328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:30:11 rmg-web-02 sshd[24324]: Connection closed by invalid user ubuntu 203.0.113.55 port 32589 [preauth]
Aug 15 09:30:12 rmg-web-02 sshd[24328]: Failed password for testuser from 203.0.113.55 port 57812 ssh2
Aug 15 09:30:16 rmg-web-02 sshd[24335]: Invalid user admin from 198.51.100.77 port 41717
Aug 15 09:30:17 rmg-web-02 sshd[24335]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:17 rmg-web-02 sshd[24335]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:30:19 rmg-web-02 sshd[24335]: Failed password for invalid user admin from 198.51.100.77 port 41717 ssh2
Aug 15 09:30:20 rmg-web-02 sshd[24335]: Connection closed by invalid user admin 198.51.100.77 port 41717 [preauth]
Aug 15 09:30:23 rmg-web-02 sshd[24338]: Invalid user git from 203.0.113.12 port 53625
Aug 15 09:30:24 rmg-web-02 sshd[24338]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:24 rmg-web-02 sshd[24338]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:30:26 rmg-web-02 sshd[24338]: Failed password for invalid user git from 203.0.113.12 port 53625 ssh2
Aug 15 09:30:27 rmg-web-02 sshd[24338]: Connection closed by invalid user git 203.0.113.12 port 53625 [preauth]
Aug 15 09:30:28 rmg-web-02 sshd[24344]: Invalid user ubuntu from 203.0.113.88 port 58406
Aug 15 09:30:29 rmg-web-02 sshd[24344]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:29 rmg-web-02 sshd[24344]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:30:31 rmg-web-02 sshd[24344]: Failed password for invalid user ubuntu from 203.0.113.88 port 58406 ssh2
Aug 15 09:30:32 rmg-web-02 sshd[24344]: Connection closed by invalid user ubuntu 203.0.113.88 port 58406 [preauth]
Aug 15 09:30:35 rmg-web-02 sshd[24353]: Invalid user ubuntu from 203.0.113.55 port 41535
Aug 15 09:30:36 rmg-web-02 sshd[24353]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:36 rmg-web-02 sshd[24353]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:38 rmg-web-02 sshd[24353]: Failed password for invalid user ubuntu from 203.0.113.55 port 41535 ssh2
Aug 15 09:30:39 rmg-web-02 sshd[24353]: Connection closed by invalid user ubuntu 203.0.113.55 port 41535 [preauth]
Aug 15 09:30:39 rmg-web-02 sshd[24356]: Invalid user deploy from 203.0.113.55 port 54850
Aug 15 09:30:40 rmg-web-02 sshd[24356]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:40 rmg-web-02 sshd[24356]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:42 rmg-web-02 sshd[24356]: Failed password for invalid user deploy from 203.0.113.55 port 54850 ssh2
Aug 15 09:30:43 rmg-web-02 sshd[24356]: Connection closed by invalid user deploy 203.0.113.55 port 54850 [preauth]
Aug 15 09:30:50 rmg-web-02 sshd[24362]: Invalid user ubuntu from 203.0.113.55 port 63156
Aug 15 09:30:51 rmg-web-02 sshd[24362]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:51 rmg-web-02 sshd[24362]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:30:53 rmg-web-02 sshd[24362]: Failed password for invalid user ubuntu from 203.0.113.55 port 63156 ssh2
Aug 15 09:30:54 rmg-web-02 sshd[24362]: Connection closed by invalid user ubuntu 203.0.113.55 port 63156 [preauth]
Aug 15 09:30:58 rmg-web-02 sshd[24370]: Invalid user ubuntu from 203.0.113.55 port 57537
Aug 15 09:30:59 rmg-web-02 sshd[24370]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:30:59 rmg-web-02 sshd[24370]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:01 rmg-web-02 sshd[24370]: Failed password for invalid user ubuntu from 203.0.113.55 port 57537 ssh2
Aug 15 09:31:02 rmg-web-02 sshd[24370]: Connection closed by invalid user ubuntu 203.0.113.55 port 57537 [preauth]
Aug 15 09:31:09 rmg-web-02 sshd[24371]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:31:11 rmg-web-02 sshd[24371]: Failed password for postgres from 203.0.113.55 port 30522 ssh2
Aug 15 09:31:17 rmg-web-02 sshd[24376]: Invalid user oracle from 203.0.113.88 port 44820
Aug 15 09:31:18 rmg-web-02 sshd[24376]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:18 rmg-web-02 sshd[24376]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:31:20 rmg-web-02 sshd[24376]: Failed password for invalid user oracle from 203.0.113.88 port 44820 ssh2
Aug 15 09:31:21 rmg-web-02 sshd[24376]: Connection closed by invalid user oracle 203.0.113.88 port 44820 [preauth]
Aug 15 09:31:26 rmg-web-02 sshd[24380]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:31:28 rmg-web-02 sshd[24380]: Failed password for testuser from 203.0.113.88 port 55195 ssh2
Aug 15 09:31:33 rmg-web-02 sshd[24384]: Invalid user admin from 198.51.100.77 port 55967
Aug 15 09:31:34 rmg-web-02 sshd[24384]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:34 rmg-web-02 sshd[24384]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:31:36 rmg-web-02 sshd[24384]: Failed password for invalid user admin from 198.51.100.77 port 55967 ssh2
Aug 15 09:31:37 rmg-web-02 sshd[24384]: Connection closed by invalid user admin 198.51.100.77 port 55967 [preauth]
Aug 15 09:31:39 rmg-web-02 sshd[24393]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:31:41 rmg-web-02 sshd[24393]: Failed password for testuser from 203.0.113.55 port 56276 ssh2
Aug 15 09:31:42 rmg-web-02 sshd[24395]: Invalid user git from 203.0.113.55 port 58726
Aug 15 09:31:43 rmg-web-02 sshd[24395]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:43 rmg-web-02 sshd[24395]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:45 rmg-web-02 sshd[24395]: Failed password for invalid user git from 203.0.113.55 port 58726 ssh2
Aug 15 09:31:46 rmg-web-02 sshd[24395]: Connection closed by invalid user git 203.0.113.55 port 58726 [preauth]
Aug 15 09:31:46 rmg-web-02 sshd[24402]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:31:48 rmg-web-02 sshd[24402]: Failed password for root from 203.0.113.88 port 35294 ssh2
Aug 15 09:31:53 rmg-web-02 sshd[24406]: Invalid user ubuntu from 203.0.113.55 port 38174
Aug 15 09:31:54 rmg-web-02 sshd[24406]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:31:54 rmg-web-02 sshd[24406]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:31:56 rmg-web-02 sshd[24406]: Failed password for invalid user ubuntu from 203.0.113.55 port 38174 ssh2
Aug 15 09:31:57 rmg-web-02 sshd[24406]: Connection closed by invalid user ubuntu 203.0.113.55 port 38174 [preauth]
Aug 15 09:32:01 rmg-web-02 sshd[24410]: Invalid user oracle from 203.0.113.12 port 46021
Aug 15 09:32:02 rmg-web-02 sshd[24410]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:02 rmg-web-02 sshd[24410]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:32:04 rmg-web-02 sshd[24410]: Failed password for invalid user oracle from 203.0.113.12 port 46021 ssh2
Aug 15 09:32:05 rmg-web-02 sshd[24410]: Connection closed by invalid user oracle 203.0.113.12 port 46021 [preauth]
Aug 15 09:32:07 rmg-web-02 sshd[24411]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:32:09 rmg-web-02 sshd[24411]: Failed password for root from 203.0.113.55 port 35480 ssh2
Aug 15 09:32:12 rmg-web-02 sshd[24416]: Invalid user git from 203.0.113.55 port 35932
Aug 15 09:32:13 rmg-web-02 sshd[24416]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:13 rmg-web-02 sshd[24416]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:32:15 rmg-web-02 sshd[24416]: Failed password for invalid user git from 203.0.113.55 port 35932 ssh2
Aug 15 09:32:16 rmg-web-02 sshd[24416]: Connection closed by invalid user git 203.0.113.55 port 35932 [preauth]
Aug 15 09:32:18 rmg-web-02 sshd[24425]: Invalid user test from 198.51.100.77 port 35073
Aug 15 09:32:19 rmg-web-02 sshd[24425]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:19 rmg-web-02 sshd[24425]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:32:21 rmg-web-02 sshd[24425]: Failed password for invalid user test from 198.51.100.77 port 35073 ssh2
Aug 15 09:32:22 rmg-web-02 sshd[24425]: Connection closed by invalid user test 198.51.100.77 port 35073 [preauth]
Aug 15 09:32:27 rmg-web-02 sshd[24430]: Invalid user oracle from 203.0.113.55 port 31384
Aug 15 09:32:28 rmg-web-02 sshd[24430]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:28 rmg-web-02 sshd[24430]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:32:30 rmg-web-02 sshd[24430]: Failed password for invalid user oracle from 203.0.113.55 port 31384 ssh2
Aug 15 09:32:31 rmg-web-02 sshd[24430]: Connection closed by invalid user oracle 203.0.113.55 port 31384 [preauth]
Aug 15 09:32:36 rmg-web-02 sshd[24435]: Invalid user oracle from 203.0.113.88 port 44426
Aug 15 09:32:37 rmg-web-02 sshd[24435]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:37 rmg-web-02 sshd[24435]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:32:39 rmg-web-02 sshd[24435]: Failed password for invalid user oracle from 203.0.113.88 port 44426 ssh2
Aug 15 09:32:40 rmg-web-02 sshd[24435]: Connection closed by invalid user oracle 203.0.113.88 port 44426 [preauth]
Aug 15 09:32:47 rmg-web-02 sshd[24444]: Invalid user test from 203.0.113.88 port 55400
Aug 15 09:32:48 rmg-web-02 sshd[24444]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:32:48 rmg-web-02 sshd[24444]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:32:50 rmg-web-02 sshd[24444]: Failed password for invalid user test from 203.0.113.88 port 55400 ssh2
Aug 15 09:32:51 rmg-web-02 sshd[24444]: Connection closed by invalid user test 203.0.113.88 port 55400 [preauth]
Aug 15 09:32:57 rmg-web-02 sshd[24446]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:32:59 rmg-web-02 sshd[24446]: Failed password for postgres from 198.51.100.77 port 57887 ssh2
Aug 15 09:33:00 rmg-web-02 sshd[24451]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:33:02 rmg-web-02 sshd[24451]: Failed password for root from 203.0.113.55 port 55565 ssh2
Aug 15 09:33:09 rmg-web-02 sshd[24454]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:33:11 rmg-web-02 sshd[24454]: Failed password for root from 203.0.113.88 port 35893 ssh2
Aug 15 09:33:14 rmg-web-02 sshd[24461]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:33:16 rmg-web-02 sshd[24461]: Failed password for testuser from 203.0.113.88 port 59703 ssh2
Aug 15 09:33:19 rmg-web-02 sshd[24462]: Invalid user ubuntu from 203.0.113.55 port 41264
Aug 15 09:33:20 rmg-web-02 sshd[24462]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:33:20 rmg-web-02 sshd[24462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:33:22 rmg-web-02 sshd[24462]: Failed password for invalid user ubuntu from 203.0.113.55 port 41264 ssh2
Aug 15 09:33:23 rmg-web-02 sshd[24462]: Connection closed by invalid user ubuntu 203.0.113.55 port 41264 [preauth]
Aug 15 09:33:29 rmg-web-02 sshd[24467]: Invalid user git from 203.0.113.55 port 40148
Aug 15 09:33:30 rmg-web-02 sshd[24467]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:33:30 rmg-web-02 sshd[24467]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:33:32 rmg-web-02 sshd[24467]: Failed password for invalid user git from 203.0.113.55 port 40148 ssh2
Aug 15 09:33:33 rmg-web-02 sshd[24467]: Connection closed by invalid user git 203.0.113.55 port 40148 [preauth]
Aug 15 09:33:37 rmg-web-02 sshd[24471]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:33:39 rmg-web-02 sshd[24471]: Failed password for root from 203.0.113.55 port 47376 ssh2
Aug 15 09:33:47 rmg-web-02 sshd[24478]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:33:49 rmg-web-02 sshd[24478]: Failed password for testuser from 203.0.113.55 port 63057 ssh2
Aug 15 09:33:57 rmg-web-02 sshd[24483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:33:59 rmg-web-02 sshd[24483]: Failed password for postgres from 203.0.113.55 port 53439 ssh2
Aug 15 09:34:05 rmg-web-02 sshd[24490]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:34:07 rmg-web-02 sshd[24490]: Failed password for testuser from 203.0.113.55 port 54301 ssh2
Aug 15 09:34:10 rmg-web-02 sshd[24492]: Invalid user deploy from 203.0.113.88 port 34417
Aug 15 09:34:11 rmg-web-02 sshd[24492]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:11 rmg-web-02 sshd[24492]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:13 rmg-web-02 sshd[24492]: Failed password for invalid user deploy from 203.0.113.88 port 34417 ssh2
Aug 15 09:34:14 rmg-web-02 sshd[24492]: Connection closed by invalid user deploy 203.0.113.88 port 34417 [preauth]
Aug 15 09:34:20 rmg-web-02 sshd[24498]: Invalid user deploy from 203.0.113.55 port 44093
Aug 15 09:34:21 rmg-web-02 sshd[24498]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:21 rmg-web-02 sshd[24498]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:23 rmg-web-02 sshd[24498]: Failed password for invalid user deploy from 203.0.113.55 port 44093 ssh2
Aug 15 09:34:24 rmg-web-02 sshd[24498]: Connection closed by invalid user deploy 203.0.113.55 port 44093 [preauth]
Aug 15 09:34:26 rmg-web-02 sshd[24500]: Invalid user deploy from 203.0.113.88 port 49692
Aug 15 09:34:27 rmg-web-02 sshd[24500]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:27 rmg-web-02 sshd[24500]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:29 rmg-web-02 sshd[24500]: Failed password for invalid user deploy from 203.0.113.88 port 49692 ssh2
Aug 15 09:34:30 rmg-web-02 sshd[24500]: Connection closed by invalid user deploy 203.0.113.88 port 49692 [preauth]
Aug 15 09:34:31 rmg-web-02 sshd[24501]: Invalid user test from 203.0.113.88 port 35319
Aug 15 09:34:32 rmg-web-02 sshd[24501]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:32 rmg-web-02 sshd[24501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:34:34 rmg-web-02 sshd[24501]: Failed password for invalid user test from 203.0.113.88 port 35319 ssh2
Aug 15 09:34:35 rmg-web-02 sshd[24501]: Connection closed by invalid user test 203.0.113.88 port 35319 [preauth]
Aug 15 09:34:35 rmg-web-02 sshd[24507]: Invalid user ubuntu from 203.0.113.55 port 33449
Aug 15 09:34:36 rmg-web-02 sshd[24507]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:36 rmg-web-02 sshd[24507]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:38 rmg-web-02 sshd[24507]: Failed password for invalid user ubuntu from 203.0.113.55 port 33449 ssh2
Aug 15 09:34:39 rmg-web-02 sshd[24507]: Connection closed by invalid user ubuntu 203.0.113.55 port 33449 [preauth]
Aug 15 09:34:46 rmg-web-02 sshd[24509]: Invalid user deploy from 203.0.113.55 port 50148
Aug 15 09:34:47 rmg-web-02 sshd[24509]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:47 rmg-web-02 sshd[24509]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:49 rmg-web-02 sshd[24509]: Failed password for invalid user deploy from 203.0.113.55 port 50148 ssh2
Aug 15 09:34:50 rmg-web-02 sshd[24509]: Connection closed by invalid user deploy 203.0.113.55 port 50148 [preauth]
Aug 15 09:34:55 rmg-web-02 sshd[24512]: Invalid user ubuntu from 203.0.113.55 port 32053
Aug 15 09:34:56 rmg-web-02 sshd[24512]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:34:56 rmg-web-02 sshd[24512]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:34:58 rmg-web-02 sshd[24512]: Failed password for invalid user ubuntu from 203.0.113.55 port 32053 ssh2
Aug 15 09:34:59 rmg-web-02 sshd[24512]: Connection closed by invalid user ubuntu 203.0.113.55 port 32053 [preauth]
Aug 15 09:35:05 rmg-web-02 sshd[24515]: Invalid user deploy from 203.0.113.55 port 43054
Aug 15 09:35:06 rmg-web-02 sshd[24515]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:06 rmg-web-02 sshd[24515]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:08 rmg-web-02 sshd[24515]: Failed password for invalid user deploy from 203.0.113.55 port 43054 ssh2
Aug 15 09:35:09 rmg-web-02 sshd[24515]: Connection closed by invalid user deploy 203.0.113.55 port 43054 [preauth]
Aug 15 09:35:14 rmg-web-02 sshd[24523]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:35:15 rmg-web-02 sshd[22046]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:35:16 rmg-web-02 sshd[24523]: Failed password for postgres from 203.0.113.55 port 33714 ssh2
Aug 15 09:35:17 rmg-web-02 sshd[22046]: Failed password for nagios from 10.20.9.40 port 51699 ssh2
Aug 15 09:35:19 rmg-web-02 sshd[24531]: Invalid user test from 203.0.113.55 port 55099
Aug 15 09:35:20 rmg-web-02 sshd[24531]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:20 rmg-web-02 sshd[24531]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:22 rmg-web-02 sshd[24531]: Failed password for invalid user test from 203.0.113.55 port 55099 ssh2
Aug 15 09:35:23 rmg-web-02 sshd[24531]: Connection closed by invalid user test 203.0.113.55 port 55099 [preauth]
Aug 15 09:35:29 rmg-web-02 sshd[24538]: Invalid user oracle from 203.0.113.55 port 43364
Aug 15 09:35:30 rmg-web-02 sshd[24538]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:30 rmg-web-02 sshd[24538]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:32 rmg-web-02 sshd[24538]: Failed password for invalid user oracle from 203.0.113.55 port 43364 ssh2
Aug 15 09:35:33 rmg-web-02 sshd[24538]: Connection closed by invalid user oracle 203.0.113.55 port 43364 [preauth]
Aug 15 09:35:39 rmg-web-02 sshd[24544]: Invalid user test from 203.0.113.55 port 43944
Aug 15 09:35:40 rmg-web-02 sshd[24544]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:40 rmg-web-02 sshd[24544]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:42 rmg-web-02 sshd[24544]: Failed password for invalid user test from 203.0.113.55 port 43944 ssh2
Aug 15 09:35:43 rmg-web-02 sshd[24544]: Connection closed by invalid user test 203.0.113.55 port 43944 [preauth]
Aug 15 09:35:45 rmg-web-02 sshd[24545]: Invalid user test from 203.0.113.12 port 53014
Aug 15 09:35:46 rmg-web-02 sshd[24545]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:46 rmg-web-02 sshd[24545]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:35:48 rmg-web-02 sshd[24545]: Failed password for invalid user test from 203.0.113.12 port 53014 ssh2
Aug 15 09:35:49 rmg-web-02 sshd[24545]: Connection closed by invalid user test 203.0.113.12 port 53014 [preauth]
Aug 15 09:35:49 rmg-web-02 sshd[24546]: Invalid user git from 203.0.113.55 port 35017
Aug 15 09:35:50 rmg-web-02 sshd[24546]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:35:50 rmg-web-02 sshd[24546]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:35:52 rmg-web-02 sshd[24546]: Failed password for invalid user git from 203.0.113.55 port 35017 ssh2
Aug 15 09:35:53 rmg-web-02 sshd[24546]: Connection closed by invalid user git 203.0.113.55 port 35017 [preauth]
Aug 15 09:35:53 rmg-web-02 sshd[24555]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=root
Aug 15 09:35:55 rmg-web-02 sshd[24555]: Failed password for root from 203.0.113.12 port 44678 ssh2
Aug 15 09:35:59 rmg-web-02 sshd[24556]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:36:01 rmg-web-02 sshd[24556]: Failed password for root from 203.0.113.55 port 57080 ssh2
Aug 15 09:36:03 rmg-web-02 sshd[24564]: Invalid user admin from 203.0.113.88 port 30151
Aug 15 09:36:04 rmg-web-02 sshd[24564]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:04 rmg-web-02 sshd[24564]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:36:06 rmg-web-02 sshd[24564]: Failed password for invalid user admin from 203.0.113.88 port 30151 ssh2
Aug 15 09:36:07 rmg-web-02 sshd[24564]: Connection closed by invalid user admin 203.0.113.88 port 30151 [preauth]
Aug 15 09:36:12 rmg-web-02 sshd[24570]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:36:14 rmg-web-02 sshd[24570]: Failed password for root from 203.0.113.55 port 64113 ssh2
Aug 15 09:36:23 rmg-web-02 sshd[24574]: Invalid user test from 203.0.113.12 port 49857
Aug 15 09:36:24 rmg-web-02 sshd[24574]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:24 rmg-web-02 sshd[24574]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:36:26 rmg-web-02 sshd[24574]: Failed password for invalid user test from 203.0.113.12 port 49857 ssh2
Aug 15 09:36:27 rmg-web-02 sshd[24574]: Connection closed by invalid user test 203.0.113.12 port 49857 [preauth]
Aug 15 09:36:34 rmg-web-02 sshd[24576]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:36:36 rmg-web-02 sshd[24576]: Failed password for testuser from 203.0.113.55 port 57154 ssh2
Aug 15 09:36:44 rmg-web-02 sshd[24584]: Invalid user git from 203.0.113.88 port 51522
Aug 15 09:36:45 rmg-web-02 sshd[24584]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:45 rmg-web-02 sshd[24584]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:36:47 rmg-web-02 sshd[24584]: Failed password for invalid user git from 203.0.113.88 port 51522 ssh2
Aug 15 09:36:48 rmg-web-02 sshd[24584]: Connection closed by invalid user git 203.0.113.88 port 51522 [preauth]
Aug 15 09:36:50 rmg-web-02 sshd[24586]: Invalid user git from 198.51.100.77 port 41729
Aug 15 09:36:51 rmg-web-02 sshd[24586]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:51 rmg-web-02 sshd[24586]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:36:53 rmg-web-02 sshd[24586]: Failed password for invalid user git from 198.51.100.77 port 41729 ssh2
Aug 15 09:36:54 rmg-web-02 sshd[24586]: Connection closed by invalid user git 198.51.100.77 port 41729 [preauth]
Aug 15 09:36:57 rmg-web-02 sshd[24590]: Invalid user admin from 203.0.113.55 port 45427
Aug 15 09:36:58 rmg-web-02 sshd[24590]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:36:58 rmg-web-02 sshd[24590]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:00 rmg-web-02 sshd[24590]: Failed password for invalid user admin from 203.0.113.55 port 45427 ssh2
Aug 15 09:37:01 rmg-web-02 sshd[24590]: Connection closed by invalid user admin 203.0.113.55 port 45427 [preauth]
Aug 15 09:37:01 rmg-web-02 sshd[24599]: Invalid user ubuntu from 198.51.100.77 port 61894
Aug 15 09:37:02 rmg-web-02 sshd[24599]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:02 rmg-web-02 sshd[24599]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:37:04 rmg-web-02 sshd[24599]: Failed password for invalid user ubuntu from 198.51.100.77 port 61894 ssh2
Aug 15 09:37:05 rmg-web-02 sshd[24599]: Connection closed by invalid user ubuntu 198.51.100.77 port 61894 [preauth]
Aug 15 09:37:05 rmg-web-02 sshd[24604]: Invalid user git from 203.0.113.55 port 62351
Aug 15 09:37:06 rmg-web-02 sshd[24604]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:06 rmg-web-02 sshd[24604]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:08 rmg-web-02 sshd[24604]: Failed password for invalid user git from 203.0.113.55 port 62351 ssh2
Aug 15 09:37:09 rmg-web-02 sshd[24604]: Connection closed by invalid user git 203.0.113.55 port 62351 [preauth]
Aug 15 09:37:09 rmg-web-02 sshd[24610]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:37:11 rmg-web-02 sshd[24610]: Failed password for testuser from 198.51.100.77 port 45095 ssh2
Aug 15 09:37:12 rmg-web-02 sshd[24618]: Invalid user admin from 203.0.113.55 port 58842
Aug 15 09:37:13 rmg-web-02 sshd[24618]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:13 rmg-web-02 sshd[24618]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:15 rmg-web-02 sshd[24618]: Failed password for invalid user admin from 203.0.113.55 port 58842 ssh2
Aug 15 09:37:16 rmg-web-02 sshd[24618]: Connection closed by invalid user admin 203.0.113.55 port 58842 [preauth]
Aug 15 09:37:19 rmg-web-02 sshd[24623]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:37:21 rmg-web-02 sshd[24623]: Failed password for postgres from 198.51.100.77 port 53588 ssh2
Aug 15 09:37:22 rmg-web-02 sshd[24632]: Invalid user admin from 203.0.113.55 port 32146
Aug 15 09:37:23 rmg-web-02 sshd[24632]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:23 rmg-web-02 sshd[24632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:25 rmg-web-02 sshd[24632]: Failed password for invalid user admin from 203.0.113.55 port 32146 ssh2
Aug 15 09:37:26 rmg-web-02 sshd[24632]: Connection closed by invalid user admin 203.0.113.55 port 32146 [preauth]
Aug 15 09:37:27 rmg-web-02 sshd[24641]: Invalid user oracle from 203.0.113.55 port 41565
Aug 15 09:37:28 rmg-web-02 sshd[24641]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:28 rmg-web-02 sshd[24641]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:30 rmg-web-02 sshd[24641]: Failed password for invalid user oracle from 203.0.113.55 port 41565 ssh2
Aug 15 09:37:31 rmg-web-02 sshd[24641]: Connection closed by invalid user oracle 203.0.113.55 port 41565 [preauth]
Aug 15 09:37:35 rmg-web-02 sshd[24649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:37:37 rmg-web-02 sshd[24649]: Failed password for postgres from 203.0.113.55 port 31099 ssh2
Aug 15 09:37:40 rmg-web-02 sshd[24655]: Invalid user deploy from 203.0.113.55 port 43617
Aug 15 09:37:41 rmg-web-02 sshd[24655]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:41 rmg-web-02 sshd[24655]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:43 rmg-web-02 sshd[24655]: Failed password for invalid user deploy from 203.0.113.55 port 43617 ssh2
Aug 15 09:37:43 rmg-web-02 sshd[24656]: Invalid user test from 198.51.100.77 port 33492
Aug 15 09:37:44 rmg-web-02 sshd[24655]: Connection closed by invalid user deploy 203.0.113.55 port 43617 [preauth]
Aug 15 09:37:44 rmg-web-02 sshd[24656]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:44 rmg-web-02 sshd[24656]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:37:46 rmg-web-02 sshd[24656]: Failed password for invalid user test from 198.51.100.77 port 33492 ssh2
Aug 15 09:37:47 rmg-web-02 sshd[24656]: Connection closed by invalid user test 198.51.100.77 port 33492 [preauth]
Aug 15 09:37:53 rmg-web-02 sshd[24659]: Invalid user oracle from 203.0.113.55 port 54407
Aug 15 09:37:54 rmg-web-02 sshd[24659]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:37:54 rmg-web-02 sshd[24659]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:37:56 rmg-web-02 sshd[24659]: Failed password for invalid user oracle from 203.0.113.55 port 54407 ssh2
Aug 15 09:37:57 rmg-web-02 sshd[24659]: Connection closed by invalid user oracle 203.0.113.55 port 54407 [preauth]
Aug 15 09:37:59 rmg-web-02 sshd[24664]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:38:01 rmg-web-02 sshd[24664]: Failed password for root from 203.0.113.55 port 39960 ssh2
Aug 15 09:38:06 rmg-web-02 sshd[24670]: Invalid user git from 203.0.113.88 port 35947
Aug 15 09:38:07 rmg-web-02 sshd[24670]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:07 rmg-web-02 sshd[24670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:38:09 rmg-web-02 sshd[24670]: Failed password for invalid user git from 203.0.113.88 port 35947 ssh2
Aug 15 09:38:09 rmg-web-02 sshd[24678]: Invalid user deploy from 203.0.113.55 port 61532
Aug 15 09:38:10 rmg-web-02 sshd[24670]: Connection closed by invalid user git 203.0.113.88 port 35947 [preauth]
Aug 15 09:38:10 rmg-web-02 sshd[24678]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:10 rmg-web-02 sshd[24678]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:12 rmg-web-02 sshd[24678]: Failed password for invalid user deploy from 203.0.113.55 port 61532 ssh2
Aug 15 09:38:13 rmg-web-02 sshd[24678]: Connection closed by invalid user deploy 203.0.113.55 port 61532 [preauth]
Aug 15 09:38:19 rmg-web-02 sshd[24684]: Invalid user oracle from 203.0.113.55 port 58459
Aug 15 09:38:20 rmg-web-02 sshd[24684]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:20 rmg-web-02 sshd[24684]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:22 rmg-web-02 sshd[24684]: Failed password for invalid user oracle from 203.0.113.55 port 58459 ssh2
Aug 15 09:38:23 rmg-web-02 sshd[24684]: Connection closed by invalid user oracle 203.0.113.55 port 58459 [preauth]
Aug 15 09:38:24 rmg-web-02 sshd[24688]: Invalid user deploy from 203.0.113.55 port 39538
Aug 15 09:38:25 rmg-web-02 sshd[24688]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:25 rmg-web-02 sshd[24688]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:27 rmg-web-02 sshd[24688]: Failed password for invalid user deploy from 203.0.113.55 port 39538 ssh2
Aug 15 09:38:27 rmg-web-02 sshd[24696]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:38:28 rmg-web-02 sshd[24688]: Connection closed by invalid user deploy 203.0.113.55 port 39538 [preauth]
Aug 15 09:38:29 rmg-web-02 sshd[24696]: Failed password for testuser from 203.0.113.55 port 33139 ssh2
Aug 15 09:38:32 rmg-web-02 sshd[24700]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:38:34 rmg-web-02 sshd[24700]: Failed password for testuser from 203.0.113.12 port 37121 ssh2
Aug 15 09:38:40 rmg-web-02 sshd[24708]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:38:42 rmg-web-02 sshd[24708]: Failed password for testuser from 203.0.113.55 port 35309 ssh2
Aug 15 09:38:45 rmg-web-02 sshd[24714]: Invalid user test from 203.0.113.55 port 50759
Aug 15 09:38:46 rmg-web-02 sshd[24714]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:46 rmg-web-02 sshd[24714]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:38:48 rmg-web-02 sshd[24714]: Failed password for invalid user test from 203.0.113.55 port 50759 ssh2
Aug 15 09:38:49 rmg-web-02 sshd[24714]: Connection closed by invalid user test 203.0.113.55 port 50759 [preauth]
Aug 15 09:38:56 rmg-web-02 sshd[24720]: Invalid user git from 198.51.100.77 port 43873
Aug 15 09:38:57 rmg-web-02 sshd[24720]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:38:57 rmg-web-02 sshd[24720]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:38:59 rmg-web-02 sshd[24720]: Failed password for invalid user git from 198.51.100.77 port 43873 ssh2
Aug 15 09:39:00 rmg-web-02 sshd[24720]: Connection closed by invalid user git 198.51.100.77 port 43873 [preauth]
Aug 15 09:39:06 rmg-web-02 sshd[24728]: Invalid user deploy from 203.0.113.88 port 31565
Aug 15 09:39:07 rmg-web-02 sshd[24728]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:07 rmg-web-02 sshd[24728]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:39:09 rmg-web-02 sshd[24728]: Failed password for invalid user deploy from 203.0.113.88 port 31565 ssh2
Aug 15 09:39:10 rmg-web-02 sshd[24728]: Connection closed by invalid user deploy 203.0.113.88 port 31565 [preauth]
Aug 15 09:39:10 rmg-web-02 sshd[24736]: Invalid user admin from 203.0.113.88 port 45633
Aug 15 09:39:11 rmg-web-02 sshd[24736]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:11 rmg-web-02 sshd[24736]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:39:13 rmg-web-02 sshd[24736]: Failed password for invalid user admin from 203.0.113.88 port 45633 ssh2
Aug 15 09:39:14 rmg-web-02 sshd[24736]: Connection closed by invalid user admin 203.0.113.88 port 45633 [preauth]
Aug 15 09:39:21 rmg-web-02 sshd[24738]: Invalid user test from 203.0.113.55 port 32835
Aug 15 09:39:22 rmg-web-02 sshd[24738]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:22 rmg-web-02 sshd[24738]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:24 rmg-web-02 sshd[24738]: Failed password for invalid user test from 203.0.113.55 port 32835 ssh2
Aug 15 09:39:25 rmg-web-02 sshd[24738]: Connection closed by invalid user test 203.0.113.55 port 32835 [preauth]
Aug 15 09:39:26 rmg-web-02 sshd[24740]: Invalid user test from 203.0.113.55 port 64308
Aug 15 09:39:27 rmg-web-02 sshd[24740]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:27 rmg-web-02 sshd[24740]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:29 rmg-web-02 sshd[24740]: Failed password for invalid user test from 203.0.113.55 port 64308 ssh2
Aug 15 09:39:30 rmg-web-02 sshd[24740]: Connection closed by invalid user test 203.0.113.55 port 64308 [preauth]
Aug 15 09:39:37 rmg-web-02 sshd[24749]: Invalid user admin from 198.51.100.77 port 30933
Aug 15 09:39:38 rmg-web-02 sshd[24749]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:38 rmg-web-02 sshd[24749]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:39:40 rmg-web-02 sshd[24749]: Failed password for invalid user admin from 198.51.100.77 port 30933 ssh2
Aug 15 09:39:41 rmg-web-02 sshd[24749]: Connection closed by invalid user admin 198.51.100.77 port 30933 [preauth]
Aug 15 09:39:42 rmg-web-02 sshd[24753]: Invalid user admin from 203.0.113.55 port 44487
Aug 15 09:39:43 rmg-web-02 sshd[24753]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:43 rmg-web-02 sshd[24753]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:45 rmg-web-02 sshd[24753]: Failed password for invalid user admin from 203.0.113.55 port 44487 ssh2
Aug 15 09:39:46 rmg-web-02 sshd[24753]: Connection closed by invalid user admin 203.0.113.55 port 44487 [preauth]
Aug 15 09:39:49 rmg-web-02 sshd[24755]: Invalid user git from 203.0.113.55 port 31981
Aug 15 09:39:50 rmg-web-02 sshd[24755]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:50 rmg-web-02 sshd[24755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:39:52 rmg-web-02 sshd[24755]: Failed password for invalid user git from 203.0.113.55 port 31981 ssh2
Aug 15 09:39:53 rmg-web-02 sshd[24755]: Connection closed by invalid user git 203.0.113.55 port 31981 [preauth]
Aug 15 09:39:58 rmg-web-02 sshd[24763]: Invalid user oracle from 203.0.113.55 port 59564
Aug 15 09:39:59 rmg-web-02 sshd[24763]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:39:59 rmg-web-02 sshd[24763]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:40:01 rmg-web-02 sshd[24763]: Failed password for invalid user oracle from 203.0.113.55 port 59564 ssh2
Aug 15 09:40:02 rmg-web-02 sshd[24763]: Connection closed by invalid user oracle 203.0.113.55 port 59564 [preauth]
Aug 15 09:40:03 rmg-web-02 sshd[24770]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:40:05 rmg-web-02 sshd[24770]: Failed password for testuser from 203.0.113.12 port 64144 ssh2
Aug 15 09:40:06 rmg-web-02 sshd[24773]: Invalid user git from 203.0.113.12 port 43534
Aug 15 09:40:07 rmg-web-02 sshd[24773]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:07 rmg-web-02 sshd[24773]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:40:09 rmg-web-02 sshd[24773]: Failed password for invalid user git from 203.0.113.12 port 43534 ssh2
Aug 15 09:40:10 rmg-web-02 sshd[24773]: Connection closed by invalid user git 203.0.113.12 port 43534 [preauth]
Aug 15 09:40:17 rmg-web-02 sshd[22051]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:40:17 rmg-web-02 sshd[24781]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:40:19 rmg-web-02 sshd[22051]: Failed password for nagios from 10.20.9.40 port 51782 ssh2
Aug 15 09:40:19 rmg-web-02 sshd[24781]: Failed password for testuser from 203.0.113.55 port 40981 ssh2
Aug 15 09:40:22 rmg-web-02 sshd[24785]: Invalid user deploy from 203.0.113.88 port 31411
Aug 15 09:40:23 rmg-web-02 sshd[24785]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:23 rmg-web-02 sshd[24785]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:40:25 rmg-web-02 sshd[24785]: Failed password for invalid user deploy from 203.0.113.88 port 31411 ssh2
Aug 15 09:40:26 rmg-web-02 sshd[24785]: Connection closed by invalid user deploy 203.0.113.88 port 31411 [preauth]
Aug 15 09:40:28 rmg-web-02 sshd[24787]: Invalid user admin from 203.0.113.12 port 42657
Aug 15 09:40:29 rmg-web-02 sshd[24787]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:29 rmg-web-02 sshd[24787]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:40:31 rmg-web-02 sshd[24787]: Failed password for invalid user admin from 203.0.113.12 port 42657 ssh2
Aug 15 09:40:32 rmg-web-02 sshd[24787]: Connection closed by invalid user admin 203.0.113.12 port 42657 [preauth]
Aug 15 09:40:34 rmg-web-02 sshd[24789]: Invalid user git from 203.0.113.88 port 47325
Aug 15 09:40:35 rmg-web-02 sshd[24789]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:35 rmg-web-02 sshd[24789]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:40:37 rmg-web-02 sshd[24789]: Failed password for invalid user git from 203.0.113.88 port 47325 ssh2
Aug 15 09:40:38 rmg-web-02 sshd[24789]: Connection closed by invalid user git 203.0.113.88 port 47325 [preauth]
Aug 15 09:40:40 rmg-web-02 sshd[24797]: Invalid user ubuntu from 203.0.113.55 port 56567
Aug 15 09:40:41 rmg-web-02 sshd[24797]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:40:41 rmg-web-02 sshd[24797]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:40:43 rmg-web-02 sshd[24797]: Failed password for invalid user ubuntu from 203.0.113.55 port 56567 ssh2
Aug 15 09:40:44 rmg-web-02 sshd[24797]: Connection closed by invalid user ubuntu 203.0.113.55 port 56567 [preauth]
Aug 15 09:40:49 rmg-web-02 sshd[24803]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:40:51 rmg-web-02 sshd[24803]: Failed password for root from 203.0.113.55 port 42290 ssh2
Aug 15 09:41:00 rmg-web-02 sshd[24804]: Invalid user git from 203.0.113.55 port 34768
Aug 15 09:41:01 rmg-web-02 sshd[24804]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:01 rmg-web-02 sshd[24804]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:03 rmg-web-02 sshd[24804]: Failed password for invalid user git from 203.0.113.55 port 34768 ssh2
Aug 15 09:41:04 rmg-web-02 sshd[24804]: Connection closed by invalid user git 203.0.113.55 port 34768 [preauth]
Aug 15 09:41:07 rmg-web-02 sshd[24805]: Invalid user test from 203.0.113.55 port 30008
Aug 15 09:41:08 rmg-web-02 sshd[24805]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:08 rmg-web-02 sshd[24805]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:10 rmg-web-02 sshd[24805]: Failed password for invalid user test from 203.0.113.55 port 30008 ssh2
Aug 15 09:41:10 rmg-web-02 sshd[24807]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:41:11 rmg-web-02 sshd[24805]: Connection closed by invalid user test 203.0.113.55 port 30008 [preauth]
Aug 15 09:41:12 rmg-web-02 sshd[24807]: Failed password for postgres from 203.0.113.55 port 41058 ssh2
Aug 15 09:41:16 rmg-web-02 sshd[24809]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:41:18 rmg-web-02 sshd[24809]: Failed password for testuser from 203.0.113.55 port 44949 ssh2
Aug 15 09:41:21 rmg-web-02 sshd[24815]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=postgres
Aug 15 09:41:23 rmg-web-02 sshd[24815]: Failed password for postgres from 198.51.100.77 port 53520 ssh2
Aug 15 09:41:25 rmg-web-02 sshd[24824]: Invalid user git from 203.0.113.55 port 47229
Aug 15 09:41:26 rmg-web-02 sshd[24824]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:26 rmg-web-02 sshd[24824]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:28 rmg-web-02 sshd[24824]: Failed password for invalid user git from 203.0.113.55 port 47229 ssh2
Aug 15 09:41:29 rmg-web-02 sshd[24824]: Connection closed by invalid user git 203.0.113.55 port 47229 [preauth]
Aug 15 09:41:29 rmg-web-02 sshd[24831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:41:31 rmg-web-02 sshd[24831]: Failed password for root from 203.0.113.88 port 44117 ssh2
Aug 15 09:41:32 rmg-web-02 sshd[24832]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=root
Aug 15 09:41:34 rmg-web-02 sshd[24832]: Failed password for root from 203.0.113.88 port 54520 ssh2
Aug 15 09:41:43 rmg-web-02 sshd[24834]: Invalid user oracle from 203.0.113.55 port 56375
Aug 15 09:41:44 rmg-web-02 sshd[24834]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:44 rmg-web-02 sshd[24834]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:46 rmg-web-02 sshd[24834]: Failed password for invalid user oracle from 203.0.113.55 port 56375 ssh2
Aug 15 09:41:46 rmg-web-02 sshd[24842]: Invalid user test from 203.0.113.55 port 46662
Aug 15 09:41:47 rmg-web-02 sshd[24834]: Connection closed by invalid user oracle 203.0.113.55 port 56375 [preauth]
Aug 15 09:41:47 rmg-web-02 sshd[24842]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:41:47 rmg-web-02 sshd[24842]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:41:49 rmg-web-02 sshd[24842]: Failed password for invalid user test from 203.0.113.55 port 46662 ssh2
Aug 15 09:41:50 rmg-web-02 sshd[24842]: Connection closed by invalid user test 203.0.113.55 port 46662 [preauth]
Aug 15 09:41:54 rmg-web-02 sshd[24847]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:41:56 rmg-web-02 sshd[24847]: Failed password for root from 203.0.113.55 port 43637 ssh2
Aug 15 09:41:59 rmg-web-02 sshd[24850]: Invalid user git from 203.0.113.12 port 62709
Aug 15 09:42:00 rmg-web-02 sshd[24850]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:00 rmg-web-02 sshd[24850]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:42:02 rmg-web-02 sshd[24850]: Failed password for invalid user git from 203.0.113.12 port 62709 ssh2
Aug 15 09:42:03 rmg-web-02 sshd[24850]: Connection closed by invalid user git 203.0.113.12 port 62709 [preauth]
Aug 15 09:42:04 rmg-web-02 sshd[24852]: Invalid user admin from 203.0.113.55 port 38326
Aug 15 09:42:05 rmg-web-02 sshd[24852]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:05 rmg-web-02 sshd[24852]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:07 rmg-web-02 sshd[24852]: Failed password for invalid user admin from 203.0.113.55 port 38326 ssh2
Aug 15 09:42:07 rmg-web-02 sshd[24853]: Invalid user oracle from 203.0.113.55 port 37132
Aug 15 09:42:08 rmg-web-02 sshd[24852]: Connection closed by invalid user admin 203.0.113.55 port 38326 [preauth]
Aug 15 09:42:08 rmg-web-02 sshd[24853]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:08 rmg-web-02 sshd[24853]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:10 rmg-web-02 sshd[24853]: Failed password for invalid user oracle from 203.0.113.55 port 37132 ssh2
Aug 15 09:42:11 rmg-web-02 sshd[24853]: Connection closed by invalid user oracle 203.0.113.55 port 37132 [preauth]
Aug 15 09:42:13 rmg-web-02 sshd[24856]: Invalid user oracle from 198.51.100.77 port 59112
Aug 15 09:42:14 rmg-web-02 sshd[24856]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:14 rmg-web-02 sshd[24856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:16 rmg-web-02 sshd[24856]: Failed password for invalid user oracle from 198.51.100.77 port 59112 ssh2
Aug 15 09:42:17 rmg-web-02 sshd[24856]: Connection closed by invalid user oracle 198.51.100.77 port 59112 [preauth]
Aug 15 09:42:22 rmg-web-02 sshd[24860]: Invalid user ubuntu from 198.51.100.77 port 60337
Aug 15 09:42:23 rmg-web-02 sshd[24860]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:23 rmg-web-02 sshd[24860]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:25 rmg-web-02 sshd[24860]: Failed password for invalid user ubuntu from 198.51.100.77 port 60337 ssh2
Aug 15 09:42:26 rmg-web-02 sshd[24860]: Connection closed by invalid user ubuntu 198.51.100.77 port 60337 [preauth]
Aug 15 09:42:28 rmg-web-02 sshd[24861]: Invalid user test from 203.0.113.55 port 49531
Aug 15 09:42:29 rmg-web-02 sshd[24861]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:29 rmg-web-02 sshd[24861]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:31 rmg-web-02 sshd[24861]: Failed password for invalid user test from 203.0.113.55 port 49531 ssh2
Aug 15 09:42:32 rmg-web-02 sshd[24861]: Connection closed by invalid user test 203.0.113.55 port 49531 [preauth]
Aug 15 09:42:36 rmg-web-02 sshd[24869]: Invalid user deploy from 203.0.113.55 port 42856
Aug 15 09:42:37 rmg-web-02 sshd[24869]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:37 rmg-web-02 sshd[24869]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:42:39 rmg-web-02 sshd[24869]: Failed password for invalid user deploy from 203.0.113.55 port 42856 ssh2
Aug 15 09:42:40 rmg-web-02 sshd[24869]: Connection closed by invalid user deploy 203.0.113.55 port 42856 [preauth]
Aug 15 09:42:43 rmg-web-02 sshd[24878]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:42:45 rmg-web-02 sshd[24878]: Failed password for testuser from 203.0.113.88 port 46291 ssh2
Aug 15 09:42:48 rmg-web-02 sshd[24884]: Invalid user git from 198.51.100.77 port 39256
Aug 15 09:42:49 rmg-web-02 sshd[24884]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:49 rmg-web-02 sshd[24884]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:42:51 rmg-web-02 sshd[24884]: Failed password for invalid user git from 198.51.100.77 port 39256 ssh2
Aug 15 09:42:52 rmg-web-02 sshd[24884]: Connection closed by invalid user git 198.51.100.77 port 39256 [preauth]
Aug 15 09:42:57 rmg-web-02 sshd[24891]: Invalid user admin from 203.0.113.88 port 58270
Aug 15 09:42:58 rmg-web-02 sshd[24891]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:42:58 rmg-web-02 sshd[24891]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:43:00 rmg-web-02 sshd[24891]: Failed password for invalid user admin from 203.0.113.88 port 58270 ssh2
Aug 15 09:43:01 rmg-web-02 sshd[24891]: Connection closed by invalid user admin 203.0.113.88 port 58270 [preauth]
Aug 15 09:43:06 rmg-web-02 sshd[24896]: Invalid user git from 203.0.113.55 port 42095
Aug 15 09:43:07 rmg-web-02 sshd[24896]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:07 rmg-web-02 sshd[24896]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:09 rmg-web-02 sshd[24896]: Failed password for invalid user git from 203.0.113.55 port 42095 ssh2
Aug 15 09:43:10 rmg-web-02 sshd[24896]: Connection closed by invalid user git 203.0.113.55 port 42095 [preauth]
Aug 15 09:43:10 rmg-web-02 sshd[24900]: Invalid user test from 203.0.113.55 port 55216
Aug 15 09:43:11 rmg-web-02 sshd[24900]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:11 rmg-web-02 sshd[24900]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:13 rmg-web-02 sshd[24900]: Failed password for invalid user test from 203.0.113.55 port 55216 ssh2
Aug 15 09:43:13 rmg-web-02 sshd[24901]: Invalid user ubuntu from 203.0.113.88 port 33679
Aug 15 09:43:14 rmg-web-02 sshd[24900]: Connection closed by invalid user test 203.0.113.55 port 55216 [preauth]
Aug 15 09:43:14 rmg-web-02 sshd[24901]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:14 rmg-web-02 sshd[24901]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:43:16 rmg-web-02 sshd[24901]: Failed password for invalid user ubuntu from 203.0.113.88 port 33679 ssh2
Aug 15 09:43:17 rmg-web-02 sshd[24901]: Connection closed by invalid user ubuntu 203.0.113.88 port 33679 [preauth]
Aug 15 09:43:22 rmg-web-02 sshd[24906]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=testuser
Aug 15 09:43:24 rmg-web-02 sshd[24906]: Failed password for testuser from 203.0.113.55 port 42984 ssh2
Aug 15 09:43:33 rmg-web-02 sshd[24910]: Invalid user oracle from 203.0.113.55 port 40945
Aug 15 09:43:34 rmg-web-02 sshd[24910]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:34 rmg-web-02 sshd[24910]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:36 rmg-web-02 sshd[24910]: Failed password for invalid user oracle from 203.0.113.55 port 40945 ssh2
Aug 15 09:43:37 rmg-web-02 sshd[24910]: Connection closed by invalid user oracle 203.0.113.55 port 40945 [preauth]
Aug 15 09:43:44 rmg-web-02 sshd[24914]: Invalid user oracle from 203.0.113.12 port 38635
Aug 15 09:43:45 rmg-web-02 sshd[24914]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:45 rmg-web-02 sshd[24914]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:43:47 rmg-web-02 sshd[24914]: Failed password for invalid user oracle from 203.0.113.12 port 38635 ssh2
Aug 15 09:43:48 rmg-web-02 sshd[24914]: Connection closed by invalid user oracle 203.0.113.12 port 38635 [preauth]
Aug 15 09:43:53 rmg-web-02 sshd[24921]: Invalid user ubuntu from 203.0.113.55 port 48997
Aug 15 09:43:54 rmg-web-02 sshd[24921]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:54 rmg-web-02 sshd[24921]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:43:56 rmg-web-02 sshd[24921]: Failed password for invalid user ubuntu from 203.0.113.55 port 48997 ssh2
Aug 15 09:43:56 rmg-web-02 sshd[24924]: Invalid user admin from 198.51.100.77 port 61578
Aug 15 09:43:57 rmg-web-02 sshd[24921]: Connection closed by invalid user ubuntu 203.0.113.55 port 48997 [preauth]
Aug 15 09:43:57 rmg-web-02 sshd[24924]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:43:57 rmg-web-02 sshd[24924]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:43:59 rmg-web-02 sshd[24924]: Failed password for invalid user admin from 198.51.100.77 port 61578 ssh2
Aug 15 09:44:00 rmg-web-02 sshd[24924]: Connection closed by invalid user admin 198.51.100.77 port 61578 [preauth]
Aug 15 09:44:07 rmg-web-02 sshd[24931]: Invalid user git from 198.51.100.77 port 47875
Aug 15 09:44:08 rmg-web-02 sshd[24931]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:08 rmg-web-02 sshd[24931]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:10 rmg-web-02 sshd[24931]: Failed password for invalid user git from 198.51.100.77 port 47875 ssh2
Aug 15 09:44:11 rmg-web-02 sshd[24931]: Connection closed by invalid user git 198.51.100.77 port 47875 [preauth]
Aug 15 09:44:16 rmg-web-02 sshd[24936]: Invalid user deploy from 198.51.100.77 port 64087
Aug 15 09:44:17 rmg-web-02 sshd[24936]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:17 rmg-web-02 sshd[24936]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:19 rmg-web-02 sshd[24936]: Failed password for invalid user deploy from 198.51.100.77 port 64087 ssh2
Aug 15 09:44:20 rmg-web-02 sshd[24936]: Connection closed by invalid user deploy 198.51.100.77 port 64087 [preauth]
Aug 15 09:44:21 rmg-web-02 sshd[24943]: Invalid user oracle from 203.0.113.55 port 60644
Aug 15 09:44:22 rmg-web-02 sshd[24943]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:22 rmg-web-02 sshd[24943]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:24 rmg-web-02 sshd[24943]: Failed password for invalid user oracle from 203.0.113.55 port 60644 ssh2
Aug 15 09:44:25 rmg-web-02 sshd[24943]: Connection closed by invalid user oracle 203.0.113.55 port 60644 [preauth]
Aug 15 09:44:29 rmg-web-02 sshd[24951]: Invalid user git from 203.0.113.55 port 53194
Aug 15 09:44:30 rmg-web-02 sshd[24951]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:30 rmg-web-02 sshd[24951]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:32 rmg-web-02 sshd[24951]: Failed password for invalid user git from 203.0.113.55 port 53194 ssh2
Aug 15 09:44:33 rmg-web-02 sshd[24951]: Connection closed by invalid user git 203.0.113.55 port 53194 [preauth]
Aug 15 09:44:39 rmg-web-02 sshd[24957]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=testuser
Aug 15 09:44:41 rmg-web-02 sshd[24957]: Failed password for testuser from 203.0.113.12 port 43547 ssh2
Aug 15 09:44:43 rmg-web-02 sshd[24958]: Invalid user test from 203.0.113.55 port 57342
Aug 15 09:44:44 rmg-web-02 sshd[24958]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:44 rmg-web-02 sshd[24958]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:44:46 rmg-web-02 sshd[24958]: Failed password for invalid user test from 203.0.113.55 port 57342 ssh2
Aug 15 09:44:46 rmg-web-02 sshd[24960]: Invalid user admin from 203.0.113.12 port 33032
Aug 15 09:44:47 rmg-web-02 sshd[24958]: Connection closed by invalid user test 203.0.113.55 port 57342 [preauth]
Aug 15 09:44:47 rmg-web-02 sshd[24960]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:47 rmg-web-02 sshd[24960]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:44:49 rmg-web-02 sshd[24960]: Failed password for invalid user admin from 203.0.113.12 port 33032 ssh2
Aug 15 09:44:50 rmg-web-02 sshd[24960]: Connection closed by invalid user admin 203.0.113.12 port 33032 [preauth]
Aug 15 09:44:51 rmg-web-02 sshd[24966]: Invalid user git from 198.51.100.77 port 40565
Aug 15 09:44:52 rmg-web-02 sshd[24966]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:44:52 rmg-web-02 sshd[24966]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77
Aug 15 09:44:54 rmg-web-02 sshd[24966]: Failed password for invalid user git from 198.51.100.77 port 40565 ssh2
Aug 15 09:44:55 rmg-web-02 sshd[24966]: Connection closed by invalid user git 198.51.100.77 port 40565 [preauth]
Aug 15 09:45:00 rmg-web-02 sshd[24968]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=root
Aug 15 09:45:02 rmg-web-02 sshd[24968]: Failed password for root from 203.0.113.55 port 51599 ssh2
Aug 15 09:45:04 rmg-web-02 sshd[22056]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:45:06 rmg-web-02 sshd[22056]: Failed password for nagios from 10.20.9.40 port 59221 ssh2
Aug 15 09:45:09 rmg-web-02 sshd[24971]: Invalid user oracle from 203.0.113.12 port 53866
Aug 15 09:45:10 rmg-web-02 sshd[24971]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:10 rmg-web-02 sshd[24971]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:45:12 rmg-web-02 sshd[24971]: Failed password for invalid user oracle from 203.0.113.12 port 53866 ssh2
Aug 15 09:45:13 rmg-web-02 sshd[24971]: Connection closed by invalid user oracle 203.0.113.12 port 53866 [preauth]
Aug 15 09:45:13 rmg-web-02 sshd[24979]: Invalid user deploy from 203.0.113.88 port 35478
Aug 15 09:45:14 rmg-web-02 sshd[24979]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:14 rmg-web-02 sshd[24979]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88
Aug 15 09:45:16 rmg-web-02 sshd[24979]: Failed password for invalid user deploy from 203.0.113.88 port 35478 ssh2
Aug 15 09:45:17 rmg-web-02 sshd[24979]: Connection closed by invalid user deploy 203.0.113.88 port 35478 [preauth]
Aug 15 09:45:23 rmg-web-02 sshd[24985]: Invalid user deploy from 203.0.113.55 port 52168
Aug 15 09:45:24 rmg-web-02 sshd[24985]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:24 rmg-web-02 sshd[24985]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:45:26 rmg-web-02 sshd[24985]: Failed password for invalid user deploy from 203.0.113.55 port 52168 ssh2
Aug 15 09:45:26 rmg-web-02 sshd[24991]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.77  user=testuser
Aug 15 09:45:27 rmg-web-02 sshd[24985]: Connection closed by invalid user deploy 203.0.113.55 port 52168 [preauth]
Aug 15 09:45:28 rmg-web-02 sshd[24991]: Failed password for testuser from 198.51.100.77 port 60344 ssh2
Aug 15 09:45:37 rmg-web-02 sshd[24998]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12  user=postgres
Aug 15 09:45:39 rmg-web-02 sshd[24998]: Failed password for postgres from 203.0.113.12 port 46528 ssh2
Aug 15 09:45:47 rmg-web-02 sshd[25004]: Invalid user deploy from 203.0.113.55 port 48595
Aug 15 09:45:48 rmg-web-02 sshd[25004]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:48 rmg-web-02 sshd[25004]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:45:50 rmg-web-02 sshd[25004]: Failed password for invalid user deploy from 203.0.113.55 port 48595 ssh2
Aug 15 09:45:51 rmg-web-02 sshd[25004]: Connection closed by invalid user deploy 203.0.113.55 port 48595 [preauth]
Aug 15 09:45:51 rmg-web-02 sshd[25008]: Invalid user git from 203.0.113.12 port 63875
Aug 15 09:45:52 rmg-web-02 sshd[25008]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:45:52 rmg-web-02 sshd[25008]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:45:54 rmg-web-02 sshd[25008]: Failed password for invalid user git from 203.0.113.12 port 63875 ssh2
Aug 15 09:45:55 rmg-web-02 sshd[25008]: Connection closed by invalid user git 203.0.113.12 port 63875 [preauth]
Aug 15 09:45:59 rmg-web-02 sshd[25016]: Invalid user test from 203.0.113.12 port 57182
Aug 15 09:46:00 rmg-web-02 sshd[25016]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:00 rmg-web-02 sshd[25016]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 09:46:02 rmg-web-02 sshd[25016]: Failed password for invalid user test from 203.0.113.12 port 57182 ssh2
Aug 15 09:46:03 rmg-web-02 sshd[25016]: Connection closed by invalid user test 203.0.113.12 port 57182 [preauth]
Aug 15 09:46:05 rmg-web-02 sshd[25024]: Invalid user test from 203.0.113.55 port 59745
Aug 15 09:46:06 rmg-web-02 sshd[25024]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:06 rmg-web-02 sshd[25024]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:08 rmg-web-02 sshd[25024]: Failed password for invalid user test from 203.0.113.55 port 59745 ssh2
Aug 15 09:46:09 rmg-web-02 sshd[25024]: Connection closed by invalid user test 203.0.113.55 port 59745 [preauth]
Aug 15 09:46:16 rmg-web-02 sshd[25029]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:46:18 rmg-web-02 sshd[25029]: Failed password for postgres from 203.0.113.55 port 51843 ssh2
Aug 15 09:46:21 rmg-web-02 sshd[25036]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:46:23 rmg-web-02 sshd[25036]: Failed password for testuser from 203.0.113.88 port 61015 ssh2
Aug 15 09:46:27 rmg-web-02 sshd[25044]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.88  user=testuser
Aug 15 09:46:29 rmg-web-02 sshd[25044]: Failed password for testuser from 203.0.113.88 port 52467 ssh2
Aug 15 09:46:37 rmg-web-02 sshd[25047]: Invalid user git from 203.0.113.55 port 34726
Aug 15 09:46:38 rmg-web-02 sshd[25047]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:38 rmg-web-02 sshd[25047]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:40 rmg-web-02 sshd[25047]: Failed password for invalid user git from 203.0.113.55 port 34726 ssh2
Aug 15 09:46:41 rmg-web-02 sshd[25047]: Connection closed by invalid user git 203.0.113.55 port 34726 [preauth]
Aug 15 09:46:44 rmg-web-02 sshd[25056]: Invalid user deploy from 203.0.113.55 port 31736
Aug 15 09:46:45 rmg-web-02 sshd[25056]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:46:45 rmg-web-02 sshd[25056]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55
Aug 15 09:46:47 rmg-web-02 sshd[25056]: Failed password for invalid user deploy from 203.0.113.55 port 31736 ssh2
Aug 15 09:46:48 rmg-web-02 sshd[25056]: Connection closed by invalid user deploy 203.0.113.55 port 31736 [preauth]
Aug 15 09:46:55 rmg-web-02 sshd[25061]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.55  user=postgres
Aug 15 09:46:57 rmg-web-02 sshd[25061]: Failed password for postgres from 203.0.113.55 port 59198 ssh2
Aug 15 09:47:24 rmg-web-02 sshd[23135]: Invalid user admin from 192.0.2.44 port 53442
Aug 15 09:47:25 rmg-web-02 sshd[23135]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:47:25 rmg-web-02 sshd[23135]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 09:47:27 rmg-web-02 sshd[23135]: Failed password for invalid user admin from 192.0.2.44 port 53442 ssh2
Aug 15 09:47:28 rmg-web-02 sshd[23135]: Connection closed by invalid user admin 192.0.2.44 port 53442 [preauth]
Aug 15 09:48:54 rmg-web-02 sshd[23143]: Invalid user pi from 198.51.100.202 port 51930
Aug 15 09:48:55 rmg-web-02 sshd[23143]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 09:48:55 rmg-web-02 sshd[23143]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 09:48:57 rmg-web-02 sshd[23143]: Failed password for invalid user pi from 198.51.100.202 port 51930 ssh2
Aug 15 09:48:58 rmg-web-02 sshd[23143]: Connection closed by invalid user pi 198.51.100.202 port 51930 [preauth]
Aug 15 09:50:14 rmg-web-02 sshd[22063]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:50:16 rmg-web-02 sshd[22063]: Failed password for nagios from 10.20.9.40 port 39280 ssh2
Aug 15 09:55:22 rmg-web-02 sshd[22071]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 09:55:24 rmg-web-02 sshd[22071]: Failed password for nagios from 10.20.9.40 port 57771 ssh2
Aug 15 10:00:23 rmg-web-02 sshd[22072]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:00:25 rmg-web-02 sshd[22072]: Failed password for nagios from 10.20.9.40 port 52330 ssh2
Aug 15 10:05:06 rmg-web-02 sshd[22075]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:05:08 rmg-web-02 sshd[22075]: Failed password for nagios from 10.20.9.40 port 40657 ssh2
Aug 15 10:05:12 rmg-web-02 sshd[23189]: Invalid user support from 192.0.2.44 port 48251
Aug 15 10:05:13 rmg-web-02 sshd[23189]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:05:13 rmg-web-02 sshd[23189]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:05:15 rmg-web-02 sshd[23189]: Failed password for invalid user support from 192.0.2.44 port 48251 ssh2
Aug 15 10:05:16 rmg-web-02 sshd[23189]: Connection closed by invalid user support 192.0.2.44 port 48251 [preauth]
Aug 15 10:10:08 rmg-web-02 sshd[22079]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:10:10 rmg-web-02 sshd[22079]: Failed password for nagios from 10.20.9.40 port 60164 ssh2
Aug 15 10:14:22 rmg-web-02 sshd[25062]: Accepted password for testuser from 203.0.113.55 port 40460 ssh2
Aug 15 10:14:23 rmg-web-02 sshd[25062]: pam_unix(sshd:session): session opened for user testuser(uid=1004) by (uid=0)
Aug 15 10:15:28 rmg-web-02 sshd[22081]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:15:30 rmg-web-02 sshd[22081]: Failed password for nagios from 10.20.9.40 port 35112 ssh2
Aug 15 10:17:01 rmg-web-02 CRON[18934]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 10:17:01 rmg-web-02 CRON[25025]: pam_unix(cron:session): session closed for user root
Aug 15 10:17:15 rmg-web-02 sshd[23175]: Invalid user ubuntu from 198.51.100.23 port 61007
Aug 15 10:17:16 rmg-web-02 sshd[23175]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:17:16 rmg-web-02 sshd[23175]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 10:17:18 rmg-web-02 sshd[23175]: Failed password for invalid user ubuntu from 198.51.100.23 port 61007 ssh2
Aug 15 10:17:19 rmg-web-02 sshd[23175]: Connection closed by invalid user ubuntu 198.51.100.23 port 61007 [preauth]
Aug 15 10:18:32 rmg-web-02 sshd[23160]: Invalid user jenkins from 203.0.113.12 port 39392
Aug 15 10:18:33 rmg-web-02 sshd[23160]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:18:33 rmg-web-02 sshd[23160]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 10:18:35 rmg-web-02 sshd[23160]: Failed password for invalid user jenkins from 203.0.113.12 port 39392 ssh2
Aug 15 10:18:36 rmg-web-02 sshd[23160]: Connection closed by invalid user jenkins 203.0.113.12 port 39392 [preauth]
Aug 15 10:20:11 rmg-web-02 sshd[22085]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:20:13 rmg-web-02 sshd[22085]: Failed password for nagios from 10.20.9.40 port 44958 ssh2
Aug 15 10:22:41 rmg-web-02 sudo:  testuser : TTY=pts/1 ; PWD=/home/testuser ; USER=root ; COMMAND=/usr/sbin/useradd -m -s /bin/bash -u 1501 sysmon
Aug 15 10:22:41 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by testuser(uid=1004)
Aug 15 10:22:42 rmg-web-02 useradd[25340]: new group: name=sysmon, GID=1501
Aug 15 10:22:42 rmg-web-02 useradd[25340]: new user: name=sysmon, UID=1501, GID=1501, home=/home/sysmon, shell=/bin/bash
Aug 15 10:22:44 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 10:23:18 rmg-web-02 passwd[25361]: password for 'sysmon' changed by 'root'
Aug 15 10:25:10 rmg-web-02 sshd[22087]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:25:12 rmg-web-02 sshd[22087]: Failed password for nagios from 10.20.9.40 port 49580 ssh2
Aug 15 10:30:05 rmg-web-02 sshd[22096]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:30:07 rmg-web-02 sshd[22096]: Failed password for nagios from 10.20.9.40 port 35736 ssh2
Aug 15 10:31:05 rmg-web-02 sudo:  testuser : TTY=pts/1 ; PWD=/home/testuser ; USER=root ; COMMAND=/usr/sbin/usermod -aG sudo sysmon
Aug 15 10:31:05 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by testuser(uid=1004)
Aug 15 10:31:06 rmg-web-02 usermod[25402]: add 'sysmon' to group 'sudo'
Aug 15 10:31:06 rmg-web-02 usermod[25402]: add 'sysmon' to shadow group 'sudo'
Aug 15 10:31:08 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 10:35:04 rmg-web-02 sshd[22097]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:35:06 rmg-web-02 sshd[22097]: Failed password for nagios from 10.20.9.40 port 30304 ssh2
Aug 15 10:40:12 rmg-web-02 crontab[25455]: (sysmon) BEGIN EDIT (sysmon)
Aug 15 10:40:13 rmg-web-02 sshd[22100]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:40:15 rmg-web-02 sshd[22100]: Failed password for nagios from 10.20.9.40 port 47161 ssh2
Aug 15 10:40:51 rmg-web-02 crontab[25455]: (sysmon) REPLACE (sysmon)
Aug 15 10:40:51 rmg-web-02 crontab[25455]: (sysmon) END EDIT (sysmon)
Aug 15 10:42:33 rmg-web-02 sshd[23166]: Invalid user mysql from 192.0.2.171 port 46175
Aug 15 10:42:34 rmg-web-02 sshd[23166]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:42:34 rmg-web-02 sshd[23166]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 10:42:36 rmg-web-02 sshd[23166]: Failed password for invalid user mysql from 192.0.2.171 port 46175 ssh2
Aug 15 10:42:37 rmg-web-02 sshd[23166]: Connection closed by invalid user mysql 192.0.2.171 port 46175 [preauth]
Aug 15 10:45:21 rmg-web-02 sshd[22108]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:45:23 rmg-web-02 sshd[22108]: Failed password for nagios from 10.20.9.40 port 44441 ssh2
Aug 15 10:50:10 rmg-web-02 sshd[22109]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:50:12 rmg-web-02 sshd[22109]: Failed password for nagios from 10.20.9.40 port 51583 ssh2
Aug 15 10:52:26 rmg-web-02 sshd[23183]: Invalid user guest from 198.51.100.202 port 40956
Aug 15 10:52:27 rmg-web-02 sshd[23183]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:52:27 rmg-web-02 sshd[23183]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 10:52:29 rmg-web-02 sshd[23183]: Failed password for invalid user guest from 198.51.100.202 port 40956 ssh2
Aug 15 10:52:30 rmg-web-02 sshd[23183]: Connection closed by invalid user guest 198.51.100.202 port 40956 [preauth]
Aug 15 10:52:30 rmg-web-02 sshd[25062]: pam_unix(sshd:session): session closed for user testuser
Aug 15 10:53:07 rmg-web-02 sshd[23194]: Invalid user guest from 192.0.2.44 port 53348
Aug 15 10:53:08 rmg-web-02 sshd[23194]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:53:08 rmg-web-02 sshd[23194]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:53:10 rmg-web-02 sshd[23194]: Failed password for invalid user guest from 192.0.2.44 port 53348 ssh2
Aug 15 10:53:11 rmg-web-02 sshd[23194]: Connection closed by invalid user guest 192.0.2.44 port 53348 [preauth]
Aug 15 10:55:24 rmg-web-02 sshd[22113]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 10:55:26 rmg-web-02 sshd[22113]: Failed password for nagios from 10.20.9.40 port 37806 ssh2
Aug 15 10:59:39 rmg-web-02 sshd[23151]: Invalid user pi from 192.0.2.44 port 32710
Aug 15 10:59:40 rmg-web-02 sshd[23151]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 10:59:40 rmg-web-02 sshd[23151]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 10:59:42 rmg-web-02 sshd[23151]: Failed password for invalid user pi from 192.0.2.44 port 32710 ssh2
Aug 15 10:59:43 rmg-web-02 sshd[23151]: Connection closed by invalid user pi 192.0.2.44 port 32710 [preauth]
Aug 15 11:00:07 rmg-web-02 sshd[22118]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:00:09 rmg-web-02 sshd[22118]: Failed password for nagios from 10.20.9.40 port 57225 ssh2
Aug 15 11:00:57 rmg-web-02 sshd[23215]: Invalid user support from 192.0.2.44 port 44901
Aug 15 11:00:58 rmg-web-02 sshd[23215]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:00:58 rmg-web-02 sshd[23215]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 11:01:00 rmg-web-02 sshd[23215]: Failed password for invalid user support from 192.0.2.44 port 44901 ssh2
Aug 15 11:01:01 rmg-web-02 sshd[23215]: Connection closed by invalid user support 192.0.2.44 port 44901 [preauth]
Aug 15 11:05:02 rmg-web-02 sshd[22123]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:05:04 rmg-web-02 sshd[22123]: Failed password for nagios from 10.20.9.40 port 52306 ssh2
Aug 15 11:05:14 rmg-web-02 sshd[25064]: Accepted publickey for sysmon from 203.0.113.55 port 56524 ssh2
Aug 15 11:05:15 rmg-web-02 sshd[25064]: pam_unix(sshd:session): session opened for user sysmon(uid=1501) by (uid=0)
Aug 15 11:06:02 rmg-web-02 sudo:  sysmon : TTY=pts/3 ; PWD=/var/www/portal ; USER=root ; COMMAND=/bin/tar -czf /tmp/.cache/pt.tar.gz /var/www/portal/exports
Aug 15 11:06:02 rmg-web-02 sudo: pam_unix(sudo:session): session opened for user root(uid=0) by sysmon(uid=1501)
Aug 15 11:06:49 rmg-web-02 sshd[23198]: Invalid user test from 198.51.100.23 port 42465
Aug 15 11:06:50 rmg-web-02 sshd[23198]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:06:50 rmg-web-02 sshd[23198]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 11:06:52 rmg-web-02 sshd[23198]: Failed password for invalid user test from 198.51.100.23 port 42465 ssh2
Aug 15 11:06:53 rmg-web-02 sshd[23198]: Connection closed by invalid user test 198.51.100.23 port 42465 [preauth]
Aug 15 11:09:40 rmg-web-02 sudo: pam_unix(sudo:session): session closed for user root
Aug 15 11:10:10 rmg-web-02 sshd[22127]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:10:12 rmg-web-02 sshd[22127]: Failed password for nagios from 10.20.9.40 port 35500 ssh2
Aug 15 11:15:04 rmg-web-02 sshd[23200]: Invalid user ftpuser from 192.0.2.171 port 42999
Aug 15 11:15:05 rmg-web-02 sshd[23200]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:15:05 rmg-web-02 sshd[23200]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 11:15:07 rmg-web-02 sshd[23200]: Failed password for invalid user ftpuser from 192.0.2.171 port 42999 ssh2
Aug 15 11:15:08 rmg-web-02 sshd[23200]: Connection closed by invalid user ftpuser 192.0.2.171 port 42999 [preauth]
Aug 15 11:15:16 rmg-web-02 sshd[22133]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:15:18 rmg-web-02 sshd[22133]: Failed password for nagios from 10.20.9.40 port 46969 ssh2
Aug 15 11:17:01 rmg-web-02 CRON[13730]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 11:17:01 rmg-web-02 CRON[26697]: pam_unix(cron:session): session closed for user root
Aug 15 11:17:50 rmg-web-02 sshd[23223]: Invalid user ftpuser from 198.51.100.202 port 64210
Aug 15 11:17:51 rmg-web-02 sshd[23223]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:17:51 rmg-web-02 sshd[23223]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 11:17:53 rmg-web-02 sshd[23223]: Failed password for invalid user ftpuser from 198.51.100.202 port 64210 ssh2
Aug 15 11:17:54 rmg-web-02 sshd[23223]: Connection closed by invalid user ftpuser 198.51.100.202 port 64210 [preauth]
Aug 15 11:20:06 rmg-web-02 sshd[22138]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:20:08 rmg-web-02 sshd[22138]: Failed password for nagios from 10.20.9.40 port 45213 ssh2
Aug 15 11:25:27 rmg-web-02 sshd[22146]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:25:29 rmg-web-02 sshd[22146]: Failed password for nagios from 10.20.9.40 port 38126 ssh2
Aug 15 11:30:23 rmg-web-02 sshd[22150]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:30:25 rmg-web-02 sshd[22150]: Failed password for nagios from 10.20.9.40 port 38181 ssh2
Aug 15 11:31:55 rmg-web-02 sshd[25064]: pam_unix(sshd:session): session closed for user sysmon
Aug 15 11:35:20 rmg-web-02 sshd[22153]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:35:22 rmg-web-02 sshd[22153]: Failed password for nagios from 10.20.9.40 port 54408 ssh2
Aug 15 11:40:17 rmg-web-02 sshd[22158]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:40:19 rmg-web-02 sshd[22158]: Failed password for nagios from 10.20.9.40 port 33209 ssh2
Aug 15 11:45:15 rmg-web-02 sshd[22165]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:45:17 rmg-web-02 sshd[22165]: Failed password for nagios from 10.20.9.40 port 62145 ssh2
Aug 15 11:46:34 rmg-web-02 sshd[23205]: Invalid user ubuntu from 203.0.113.201 port 46250
Aug 15 11:46:35 rmg-web-02 sshd[23205]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:46:35 rmg-web-02 sshd[23205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 11:46:37 rmg-web-02 sshd[23205]: Failed password for invalid user ubuntu from 203.0.113.201 port 46250 ssh2
Aug 15 11:46:38 rmg-web-02 sshd[23205]: Connection closed by invalid user ubuntu 203.0.113.201 port 46250 [preauth]
Aug 15 11:47:03 rmg-web-02 sshd[23551]: pam_unix(sshd:session): session closed for user dokafor
Aug 15 11:49:18 rmg-web-02 sshd[23211]: Invalid user mysql from 203.0.113.201 port 53946
Aug 15 11:49:19 rmg-web-02 sshd[23211]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 11:49:19 rmg-web-02 sshd[23211]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 11:49:21 rmg-web-02 sshd[23211]: Failed password for invalid user mysql from 203.0.113.201 port 53946 ssh2
Aug 15 11:49:22 rmg-web-02 sshd[23211]: Connection closed by invalid user mysql 203.0.113.201 port 53946 [preauth]
Aug 15 11:50:19 rmg-web-02 sshd[22172]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:50:21 rmg-web-02 sshd[22172]: Failed password for nagios from 10.20.9.40 port 63458 ssh2
Aug 15 11:55:10 rmg-web-02 sshd[22177]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 11:55:12 rmg-web-02 sshd[22177]: Failed password for nagios from 10.20.9.40 port 56115 ssh2
Aug 15 12:00:22 rmg-web-02 sshd[22186]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:00:24 rmg-web-02 sshd[22186]: Failed password for nagios from 10.20.9.40 port 49857 ssh2
Aug 15 12:03:04 rmg-web-02 sshd[23238]: Invalid user git from 203.0.113.12 port 34592
Aug 15 12:03:05 rmg-web-02 sshd[23238]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:03:05 rmg-web-02 sshd[23238]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 12:03:07 rmg-web-02 sshd[23238]: Failed password for invalid user git from 203.0.113.12 port 34592 ssh2
Aug 15 12:03:08 rmg-web-02 sshd[23238]: Connection closed by invalid user git 203.0.113.12 port 34592 [preauth]
Aug 15 12:05:18 rmg-web-02 sshd[22194]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:05:19 rmg-web-02 sshd[23236]: Invalid user git from 198.51.100.202 port 48501
Aug 15 12:05:20 rmg-web-02 sshd[22194]: Failed password for nagios from 10.20.9.40 port 49365 ssh2
Aug 15 12:05:20 rmg-web-02 sshd[23236]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:05:20 rmg-web-02 sshd[23236]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 12:05:22 rmg-web-02 sshd[23236]: Failed password for invalid user git from 198.51.100.202 port 48501 ssh2
Aug 15 12:05:23 rmg-web-02 sshd[23236]: Connection closed by invalid user git 198.51.100.202 port 48501 [preauth]
Aug 15 12:10:00 rmg-web-02 sshd[22197]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:10:02 rmg-web-02 sshd[22197]: Failed password for nagios from 10.20.9.40 port 40744 ssh2
Aug 15 12:15:19 rmg-web-02 sshd[22200]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:15:21 rmg-web-02 sshd[22200]: Failed password for nagios from 10.20.9.40 port 43984 ssh2
Aug 15 12:17:01 rmg-web-02 CRON[21820]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 12:17:01 rmg-web-02 CRON[20489]: pam_unix(cron:session): session closed for user root
Aug 15 12:20:18 rmg-web-02 sshd[22205]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:20:20 rmg-web-02 sshd[22205]: Failed password for nagios from 10.20.9.40 port 30800 ssh2
Aug 15 12:25:20 rmg-web-02 sshd[22211]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:25:22 rmg-web-02 sshd[22211]: Failed password for nagios from 10.20.9.40 port 61236 ssh2
Aug 15 12:30:20 rmg-web-02 sshd[22220]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:30:22 rmg-web-02 sshd[22220]: Failed password for nagios from 10.20.9.40 port 45513 ssh2
Aug 15 12:35:01 rmg-web-02 sshd[22229]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:35:03 rmg-web-02 sshd[22229]: Failed password for nagios from 10.20.9.40 port 35055 ssh2
Aug 15 12:40:08 rmg-web-02 sshd[22231]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:40:10 rmg-web-02 sshd[22231]: Failed password for nagios from 10.20.9.40 port 45137 ssh2
Aug 15 12:43:01 rmg-web-02 sshd[23227]: Invalid user pi from 203.0.113.201 port 54513
Aug 15 12:43:02 rmg-web-02 sshd[23227]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 12:43:02 rmg-web-02 sshd[23227]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 12:43:04 rmg-web-02 sshd[23227]: Failed password for invalid user pi from 203.0.113.201 port 54513 ssh2
Aug 15 12:43:05 rmg-web-02 sshd[23227]: Connection closed by invalid user pi 203.0.113.201 port 54513 [preauth]
Aug 15 12:45:03 rmg-web-02 sshd[22238]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:45:05 rmg-web-02 sshd[22238]: Failed password for nagios from 10.20.9.40 port 31770 ssh2
Aug 15 12:50:03 rmg-web-02 sshd[22245]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:50:05 rmg-web-02 sshd[22245]: Failed password for nagios from 10.20.9.40 port 42343 ssh2
Aug 15 12:55:21 rmg-web-02 sshd[22248]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 12:55:23 rmg-web-02 sshd[22248]: Failed password for nagios from 10.20.9.40 port 33988 ssh2
Aug 15 13:00:26 rmg-web-02 sshd[22255]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:00:28 rmg-web-02 sshd[22255]: Failed password for nagios from 10.20.9.40 port 49335 ssh2
Aug 15 13:05:27 rmg-web-02 sshd[22261]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:05:29 rmg-web-02 sshd[22261]: Failed password for nagios from 10.20.9.40 port 40890 ssh2
Aug 15 13:10:00 rmg-web-02 sshd[22264]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:10:02 rmg-web-02 sshd[22264]: Failed password for nagios from 10.20.9.40 port 49656 ssh2
Aug 15 13:12:44 rmg-web-02 sshd[23254]: Invalid user ubuntu from 198.51.100.202 port 59311
Aug 15 13:12:45 rmg-web-02 sshd[23254]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:12:45 rmg-web-02 sshd[23254]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 13:12:47 rmg-web-02 sshd[23254]: Failed password for invalid user ubuntu from 198.51.100.202 port 59311 ssh2
Aug 15 13:12:48 rmg-web-02 sshd[23254]: Connection closed by invalid user ubuntu 198.51.100.202 port 59311 [preauth]
Aug 15 13:15:11 rmg-web-02 sshd[22269]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:15:13 rmg-web-02 sshd[22269]: Failed password for nagios from 10.20.9.40 port 48421 ssh2
Aug 15 13:17:01 rmg-web-02 CRON[26471]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 13:17:01 rmg-web-02 CRON[18160]: pam_unix(cron:session): session closed for user root
Aug 15 13:20:19 rmg-web-02 sshd[22274]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:20:21 rmg-web-02 sshd[22274]: Failed password for nagios from 10.20.9.40 port 58592 ssh2
Aug 15 13:25:04 rmg-web-02 sshd[22283]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:25:06 rmg-web-02 sshd[22283]: Failed password for nagios from 10.20.9.40 port 42080 ssh2
Aug 15 13:30:08 rmg-web-02 sshd[22292]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:30:10 rmg-web-02 sshd[22292]: Failed password for nagios from 10.20.9.40 port 51422 ssh2
Aug 15 13:35:24 rmg-web-02 sshd[22294]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:35:26 rmg-web-02 sshd[22294]: Failed password for nagios from 10.20.9.40 port 33008 ssh2
Aug 15 13:40:11 rmg-web-02 sshd[22299]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:40:13 rmg-web-02 sshd[22299]: Failed password for nagios from 10.20.9.40 port 52925 ssh2
Aug 15 13:45:04 rmg-web-02 sshd[22300]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:45:06 rmg-web-02 sshd[22300]: Failed password for nagios from 10.20.9.40 port 39863 ssh2
Aug 15 13:47:44 rmg-web-02 sshd[23261]: Invalid user jenkins from 203.0.113.140 port 39050
Aug 15 13:47:45 rmg-web-02 sshd[23261]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:47:45 rmg-web-02 sshd[23261]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 13:47:47 rmg-web-02 sshd[23261]: Failed password for invalid user jenkins from 203.0.113.140 port 39050 ssh2
Aug 15 13:47:48 rmg-web-02 sshd[23261]: Connection closed by invalid user jenkins 203.0.113.140 port 39050 [preauth]
Aug 15 13:48:10 rmg-web-02 sshd[23250]: Invalid user oracle from 198.51.100.202 port 44095
Aug 15 13:48:11 rmg-web-02 sshd[23250]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:48:11 rmg-web-02 sshd[23250]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 13:48:13 rmg-web-02 sshd[23250]: Failed password for invalid user oracle from 198.51.100.202 port 44095 ssh2
Aug 15 13:48:14 rmg-web-02 sshd[23250]: Connection closed by invalid user oracle 198.51.100.202 port 44095 [preauth]
Aug 15 13:50:30 rmg-web-02 sshd[22301]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:50:32 rmg-web-02 sshd[22301]: Failed password for nagios from 10.20.9.40 port 30594 ssh2
Aug 15 13:55:01 rmg-web-02 sshd[22308]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 13:55:03 rmg-web-02 sshd[22308]: Failed password for nagios from 10.20.9.40 port 64331 ssh2
Aug 15 13:59:24 rmg-web-02 sshd[23243]: Invalid user deploy from 203.0.113.140 port 63738
Aug 15 13:59:25 rmg-web-02 sshd[23243]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 13:59:25 rmg-web-02 sshd[23243]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 13:59:27 rmg-web-02 sshd[23243]: Failed password for invalid user deploy from 203.0.113.140 port 63738 ssh2
Aug 15 13:59:28 rmg-web-02 sshd[23243]: Connection closed by invalid user deploy 203.0.113.140 port 63738 [preauth]
Aug 15 14:00:09 rmg-web-02 sshd[22314]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:00:11 rmg-web-02 sshd[22314]: Failed password for nagios from 10.20.9.40 port 58856 ssh2
Aug 15 14:05:11 rmg-web-02 sshd[22317]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:05:13 rmg-web-02 sshd[22317]: Failed password for nagios from 10.20.9.40 port 49021 ssh2
Aug 15 14:07:41 rmg-web-02 sshd[23267]: Invalid user postgres from 192.0.2.44 port 51222
Aug 15 14:07:42 rmg-web-02 sshd[23267]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:07:42 rmg-web-02 sshd[23267]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 14:07:44 rmg-web-02 sshd[23267]: Failed password for invalid user postgres from 192.0.2.44 port 51222 ssh2
Aug 15 14:07:45 rmg-web-02 sshd[23267]: Connection closed by invalid user postgres 192.0.2.44 port 51222 [preauth]
Aug 15 14:10:02 rmg-web-02 sshd[22320]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:10:04 rmg-web-02 sshd[22320]: Failed password for nagios from 10.20.9.40 port 44262 ssh2
Aug 15 14:10:32 rmg-web-02 sshd[23291]: Invalid user jenkins from 203.0.113.201 port 54702
Aug 15 14:10:33 rmg-web-02 sshd[23291]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:10:33 rmg-web-02 sshd[23291]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 14:10:35 rmg-web-02 sshd[23291]: Failed password for invalid user jenkins from 203.0.113.201 port 54702 ssh2
Aug 15 14:10:36 rmg-web-02 sshd[23291]: Connection closed by invalid user jenkins 203.0.113.201 port 54702 [preauth]
Aug 15 14:15:05 rmg-web-02 sshd[22328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:15:07 rmg-web-02 sshd[22328]: Failed password for nagios from 10.20.9.40 port 61211 ssh2
Aug 15 14:17:01 rmg-web-02 CRON[10120]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 14:17:01 rmg-web-02 CRON[27651]: pam_unix(cron:session): session closed for user root
Aug 15 14:17:35 rmg-web-02 sshd[23274]: Invalid user guest from 198.51.100.23 port 59920
Aug 15 14:17:36 rmg-web-02 sshd[23274]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:17:36 rmg-web-02 sshd[23274]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 14:17:38 rmg-web-02 sshd[23274]: Failed password for invalid user guest from 198.51.100.23 port 59920 ssh2
Aug 15 14:17:39 rmg-web-02 sshd[23274]: Connection closed by invalid user guest 198.51.100.23 port 59920 [preauth]
Aug 15 14:19:11 rmg-web-02 sshd[23270]: Invalid user git from 192.0.2.44 port 54781
Aug 15 14:19:12 rmg-web-02 sshd[23270]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:19:12 rmg-web-02 sshd[23270]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 14:19:14 rmg-web-02 sshd[23270]: Failed password for invalid user git from 192.0.2.44 port 54781 ssh2
Aug 15 14:19:15 rmg-web-02 sshd[23270]: Connection closed by invalid user git 192.0.2.44 port 54781 [preauth]
Aug 15 14:20:02 rmg-web-02 sshd[22332]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:20:04 rmg-web-02 sshd[22332]: Failed password for nagios from 10.20.9.40 port 45143 ssh2
Aug 15 14:25:15 rmg-web-02 sshd[22339]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:25:17 rmg-web-02 sshd[22339]: Failed password for nagios from 10.20.9.40 port 35971 ssh2
Aug 15 14:30:13 rmg-web-02 sshd[22345]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:30:15 rmg-web-02 sshd[22345]: Failed password for nagios from 10.20.9.40 port 45348 ssh2
Aug 15 14:35:14 rmg-web-02 sshd[22348]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:35:16 rmg-web-02 sshd[22348]: Failed password for nagios from 10.20.9.40 port 62392 ssh2
Aug 15 14:40:21 rmg-web-02 sshd[22351]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:40:23 rmg-web-02 sshd[22351]: Failed password for nagios from 10.20.9.40 port 45254 ssh2
Aug 15 14:41:06 rmg-web-02 sshd[23279]: Invalid user user from 203.0.113.201 port 59847
Aug 15 14:41:07 rmg-web-02 sshd[23279]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:41:07 rmg-web-02 sshd[23279]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 14:41:09 rmg-web-02 sshd[23279]: Failed password for invalid user user from 203.0.113.201 port 59847 ssh2
Aug 15 14:41:10 rmg-web-02 sshd[23279]: Connection closed by invalid user user 203.0.113.201 port 59847 [preauth]
Aug 15 14:43:23 rmg-web-02 sshd[23282]: Invalid user ubuntu from 198.51.100.23 port 42457
Aug 15 14:43:24 rmg-web-02 sshd[23282]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:43:24 rmg-web-02 sshd[23282]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 14:43:26 rmg-web-02 sshd[23282]: Failed password for invalid user ubuntu from 198.51.100.23 port 42457 ssh2
Aug 15 14:43:27 rmg-web-02 sshd[23282]: Connection closed by invalid user ubuntu 198.51.100.23 port 42457 [preauth]
Aug 15 14:45:13 rmg-web-02 sshd[22354]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:45:15 rmg-web-02 sshd[22354]: Failed password for nagios from 10.20.9.40 port 33272 ssh2
Aug 15 14:47:42 rmg-web-02 sshd[23295]: Invalid user git from 198.51.100.202 port 54268
Aug 15 14:47:43 rmg-web-02 sshd[23295]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 14:47:43 rmg-web-02 sshd[23295]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 14:47:45 rmg-web-02 sshd[23295]: Failed password for invalid user git from 198.51.100.202 port 54268 ssh2
Aug 15 14:47:46 rmg-web-02 sshd[23295]: Connection closed by invalid user git 198.51.100.202 port 54268 [preauth]
Aug 15 14:50:28 rmg-web-02 sshd[22356]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:50:30 rmg-web-02 sshd[22356]: Failed password for nagios from 10.20.9.40 port 52917 ssh2
Aug 15 14:55:09 rmg-web-02 sshd[22365]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 14:55:11 rmg-web-02 sshd[22365]: Failed password for nagios from 10.20.9.40 port 30835 ssh2
Aug 15 15:00:21 rmg-web-02 sshd[23316]: Invalid user support from 203.0.113.12 port 49771
Aug 15 15:00:22 rmg-web-02 sshd[23316]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:00:22 rmg-web-02 sshd[23316]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 15:00:24 rmg-web-02 sshd[22372]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:00:24 rmg-web-02 sshd[23316]: Failed password for invalid user support from 203.0.113.12 port 49771 ssh2
Aug 15 15:00:25 rmg-web-02 sshd[23316]: Connection closed by invalid user support 203.0.113.12 port 49771 [preauth]
Aug 15 15:00:26 rmg-web-02 sshd[22372]: Failed password for nagios from 10.20.9.40 port 52692 ssh2
Aug 15 15:05:24 rmg-web-02 sshd[22377]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:05:26 rmg-web-02 sshd[22377]: Failed password for nagios from 10.20.9.40 port 34153 ssh2
Aug 15 15:08:54 rmg-web-02 sshd[23317]: Invalid user jenkins from 198.51.100.202 port 50356
Aug 15 15:08:55 rmg-web-02 sshd[23317]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:08:55 rmg-web-02 sshd[23317]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 15:08:57 rmg-web-02 sshd[23317]: Failed password for invalid user jenkins from 198.51.100.202 port 50356 ssh2
Aug 15 15:08:58 rmg-web-02 sshd[23317]: Connection closed by invalid user jenkins 198.51.100.202 port 50356 [preauth]
Aug 15 15:10:25 rmg-web-02 sshd[22379]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:10:27 rmg-web-02 sshd[22379]: Failed password for nagios from 10.20.9.40 port 57436 ssh2
Aug 15 15:15:20 rmg-web-02 sshd[22380]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:15:22 rmg-web-02 sshd[22380]: Failed password for nagios from 10.20.9.40 port 47708 ssh2
Aug 15 15:17:01 rmg-web-02 CRON[14286]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 15:17:01 rmg-web-02 CRON[28384]: pam_unix(cron:session): session closed for user root
Aug 15 15:20:07 rmg-web-02 sshd[22387]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:20:09 rmg-web-02 sshd[22387]: Failed password for nagios from 10.20.9.40 port 57747 ssh2
Aug 15 15:20:22 rmg-web-02 sshd[23325]: Invalid user support from 192.0.2.171 port 40396
Aug 15 15:20:23 rmg-web-02 sshd[23325]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:20:23 rmg-web-02 sshd[23325]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 15:20:25 rmg-web-02 sshd[23325]: Failed password for invalid user support from 192.0.2.171 port 40396 ssh2
Aug 15 15:20:26 rmg-web-02 sshd[23325]: Connection closed by invalid user support 192.0.2.171 port 40396 [preauth]
Aug 15 15:25:02 rmg-web-02 sshd[22390]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:25:04 rmg-web-02 sshd[22390]: Failed password for nagios from 10.20.9.40 port 30043 ssh2
Aug 15 15:26:19 rmg-web-02 sshd[23302]: Invalid user webmaster from 203.0.113.140 port 53683
Aug 15 15:26:20 rmg-web-02 sshd[23302]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:26:20 rmg-web-02 sshd[23302]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 15:26:22 rmg-web-02 sshd[23302]: Failed password for invalid user webmaster from 203.0.113.140 port 53683 ssh2
Aug 15 15:26:23 rmg-web-02 sshd[23302]: Connection closed by invalid user webmaster 203.0.113.140 port 53683 [preauth]
Aug 15 15:30:19 rmg-web-02 sshd[22398]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:30:21 rmg-web-02 sshd[22398]: Failed password for nagios from 10.20.9.40 port 45444 ssh2
Aug 15 15:35:23 rmg-web-02 sshd[22400]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:35:25 rmg-web-02 sshd[22400]: Failed password for nagios from 10.20.9.40 port 35971 ssh2
Aug 15 15:39:19 rmg-web-02 sshd[23310]: Invalid user mysql from 203.0.113.12 port 47574
Aug 15 15:39:20 rmg-web-02 sshd[23310]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:39:20 rmg-web-02 sshd[23310]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 15:39:22 rmg-web-02 sshd[23310]: Failed password for invalid user mysql from 203.0.113.12 port 47574 ssh2
Aug 15 15:39:23 rmg-web-02 sshd[23310]: Connection closed by invalid user mysql 203.0.113.12 port 47574 [preauth]
Aug 15 15:40:17 rmg-web-02 sshd[22403]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:40:19 rmg-web-02 sshd[22403]: Failed password for nagios from 10.20.9.40 port 50792 ssh2
Aug 15 15:41:24 rmg-web-02 sshd[23299]: Invalid user webmaster from 192.0.2.9 port 49194
Aug 15 15:41:25 rmg-web-02 sshd[23299]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 15:41:25 rmg-web-02 sshd[23299]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 15:41:27 rmg-web-02 sshd[23299]: Failed password for invalid user webmaster from 192.0.2.9 port 49194 ssh2
Aug 15 15:41:28 rmg-web-02 sshd[23299]: Connection closed by invalid user webmaster 192.0.2.9 port 49194 [preauth]
Aug 15 15:45:22 rmg-web-02 sshd[22407]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:45:24 rmg-web-02 sshd[22407]: Failed password for nagios from 10.20.9.40 port 40767 ssh2
Aug 15 15:50:21 rmg-web-02 sshd[22414]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:50:23 rmg-web-02 sshd[22414]: Failed password for nagios from 10.20.9.40 port 45536 ssh2
Aug 15 15:55:07 rmg-web-02 sshd[22422]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 15:55:09 rmg-web-02 sshd[22422]: Failed password for nagios from 10.20.9.40 port 48862 ssh2
Aug 15 16:00:04 rmg-web-02 sshd[22430]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:00:06 rmg-web-02 sshd[22430]: Failed password for nagios from 10.20.9.40 port 56392 ssh2
Aug 15 16:05:23 rmg-web-02 sshd[22438]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:05:25 rmg-web-02 sshd[22438]: Failed password for nagios from 10.20.9.40 port 55409 ssh2
Aug 15 16:10:06 rmg-web-02 sshd[22440]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:10:08 rmg-web-02 sshd[22440]: Failed password for nagios from 10.20.9.40 port 47877 ssh2
Aug 15 16:11:59 rmg-web-02 sshd[23343]: Invalid user deploy from 192.0.2.44 port 46197
Aug 15 16:12:00 rmg-web-02 sshd[23343]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:12:00 rmg-web-02 sshd[23343]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 16:12:02 rmg-web-02 sshd[23343]: Failed password for invalid user deploy from 192.0.2.44 port 46197 ssh2
Aug 15 16:12:03 rmg-web-02 sshd[23343]: Connection closed by invalid user deploy 192.0.2.44 port 46197 [preauth]
Aug 15 16:15:02 rmg-web-02 sshd[22449]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:15:04 rmg-web-02 sshd[22449]: Failed password for nagios from 10.20.9.40 port 41548 ssh2
Aug 15 16:17:01 rmg-web-02 CRON[21359]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 16:17:01 rmg-web-02 CRON[13637]: pam_unix(cron:session): session closed for user root
Aug 15 16:20:17 rmg-web-02 sshd[22455]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:20:19 rmg-web-02 sshd[22455]: Failed password for nagios from 10.20.9.40 port 49388 ssh2
Aug 15 16:25:10 rmg-web-02 sshd[22462]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:25:12 rmg-web-02 sshd[22462]: Failed password for nagios from 10.20.9.40 port 40070 ssh2
Aug 15 16:30:13 rmg-web-02 sshd[22469]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:30:15 rmg-web-02 sshd[22469]: Failed password for nagios from 10.20.9.40 port 52580 ssh2
Aug 15 16:32:59 rmg-web-02 sshd[23337]: Invalid user guest from 198.51.100.23 port 46164
Aug 15 16:33:00 rmg-web-02 sshd[23337]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:33:00 rmg-web-02 sshd[23337]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 16:33:02 rmg-web-02 sshd[23337]: Failed password for invalid user guest from 198.51.100.23 port 46164 ssh2
Aug 15 16:33:03 rmg-web-02 sshd[23337]: Connection closed by invalid user guest 198.51.100.23 port 46164 [preauth]
Aug 15 16:35:02 rmg-web-02 sshd[22476]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:35:04 rmg-web-02 sshd[22476]: Failed password for nagios from 10.20.9.40 port 54884 ssh2
Aug 15 16:38:26 rmg-web-02 sshd[23352]: Invalid user user from 198.51.100.202 port 55544
Aug 15 16:38:27 rmg-web-02 sshd[23352]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:38:27 rmg-web-02 sshd[23352]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 16:38:29 rmg-web-02 sshd[23352]: Failed password for invalid user user from 198.51.100.202 port 55544 ssh2
Aug 15 16:38:30 rmg-web-02 sshd[23352]: Connection closed by invalid user user 198.51.100.202 port 55544 [preauth]
Aug 15 16:40:11 rmg-web-02 sshd[22480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:40:13 rmg-web-02 sshd[22480]: Failed password for nagios from 10.20.9.40 port 49105 ssh2
Aug 15 16:40:25 rmg-web-02 sshd[23531]: pam_unix(sshd:session): session closed for user jmartel
Aug 15 16:40:46 rmg-web-02 sshd[23328]: Invalid user test from 198.51.100.202 port 44779
Aug 15 16:40:47 rmg-web-02 sshd[23328]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:40:47 rmg-web-02 sshd[23328]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 16:40:49 rmg-web-02 sshd[23328]: Failed password for invalid user test from 198.51.100.202 port 44779 ssh2
Aug 15 16:40:50 rmg-web-02 sshd[23328]: Connection closed by invalid user test 198.51.100.202 port 44779 [preauth]
Aug 15 16:45:05 rmg-web-02 sshd[22487]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:45:07 rmg-web-02 sshd[22487]: Failed password for nagios from 10.20.9.40 port 61274 ssh2
Aug 15 16:46:17 rmg-web-02 sshd[23333]: Invalid user deploy from 203.0.113.201 port 40805
Aug 15 16:46:18 rmg-web-02 sshd[23333]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 16:46:18 rmg-web-02 sshd[23333]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 16:46:20 rmg-web-02 sshd[23333]: Failed password for invalid user deploy from 203.0.113.201 port 40805 ssh2
Aug 15 16:46:21 rmg-web-02 sshd[23333]: Connection closed by invalid user deploy 203.0.113.201 port 40805 [preauth]
Aug 15 16:47:06 rmg-web-02 sshd[23537]: pam_unix(sshd:session): session closed for user dokafor
Aug 15 16:50:21 rmg-web-02 sshd[22489]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:50:23 rmg-web-02 sshd[22489]: Failed password for nagios from 10.20.9.40 port 37895 ssh2
Aug 15 16:54:55 rmg-web-02 sshd[23545]: pam_unix(sshd:session): session closed for user rchen
Aug 15 16:55:24 rmg-web-02 sshd[22494]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 16:55:26 rmg-web-02 sshd[22494]: Failed password for nagios from 10.20.9.40 port 36340 ssh2
Aug 15 17:00:25 rmg-web-02 sshd[22500]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:00:27 rmg-web-02 sshd[22500]: Failed password for nagios from 10.20.9.40 port 54409 ssh2
Aug 15 17:05:13 rmg-web-02 sshd[22501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:05:15 rmg-web-02 sshd[22501]: Failed password for nagios from 10.20.9.40 port 43236 ssh2
Aug 15 17:06:04 rmg-web-02 sshd[23361]: Invalid user test from 203.0.113.140 port 64204
Aug 15 17:06:05 rmg-web-02 sshd[23361]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:06:05 rmg-web-02 sshd[23361]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 17:06:07 rmg-web-02 sshd[23361]: Failed password for invalid user test from 203.0.113.140 port 64204 ssh2
Aug 15 17:06:08 rmg-web-02 sshd[23361]: Connection closed by invalid user test 203.0.113.140 port 64204 [preauth]
Aug 15 17:10:20 rmg-web-02 sshd[22503]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:10:22 rmg-web-02 sshd[22503]: Failed password for nagios from 10.20.9.40 port 63914 ssh2
Aug 15 17:15:10 rmg-web-02 sshd[22506]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:15:12 rmg-web-02 sshd[22506]: Failed password for nagios from 10.20.9.40 port 62005 ssh2
Aug 15 17:17:01 rmg-web-02 CRON[25352]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 17:17:01 rmg-web-02 CRON[16762]: pam_unix(cron:session): session closed for user root
Aug 15 17:18:50 rmg-web-02 sshd[23376]: Invalid user deploy from 198.51.100.202 port 37139
Aug 15 17:18:51 rmg-web-02 sshd[23376]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:18:51 rmg-web-02 sshd[23376]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:18:53 rmg-web-02 sshd[23376]: Failed password for invalid user deploy from 198.51.100.202 port 37139 ssh2
Aug 15 17:18:54 rmg-web-02 sshd[23376]: Connection closed by invalid user deploy 198.51.100.202 port 37139 [preauth]
Aug 15 17:20:22 rmg-web-02 sshd[22507]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:20:24 rmg-web-02 sshd[22507]: Failed password for nagios from 10.20.9.40 port 64329 ssh2
Aug 15 17:25:28 rmg-web-02 sshd[22508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:25:30 rmg-web-02 sshd[22508]: Failed password for nagios from 10.20.9.40 port 39656 ssh2
Aug 15 17:26:08 rmg-web-02 sshd[23379]: Invalid user guest from 192.0.2.171 port 42572
Aug 15 17:26:09 rmg-web-02 sshd[23379]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:26:09 rmg-web-02 sshd[23379]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 17:26:11 rmg-web-02 sshd[23379]: Failed password for invalid user guest from 192.0.2.171 port 42572 ssh2
Aug 15 17:26:12 rmg-web-02 sshd[23379]: Connection closed by invalid user guest 192.0.2.171 port 42572 [preauth]
Aug 15 17:30:15 rmg-web-02 sshd[22513]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:30:17 rmg-web-02 sshd[22513]: Failed password for nagios from 10.20.9.40 port 57267 ssh2
Aug 15 17:35:23 rmg-web-02 sshd[22520]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:35:25 rmg-web-02 sshd[22520]: Failed password for nagios from 10.20.9.40 port 50626 ssh2
Aug 15 17:36:51 rmg-web-02 sshd[23374]: Invalid user admin from 198.51.100.202 port 50720
Aug 15 17:36:52 rmg-web-02 sshd[23374]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:36:52 rmg-web-02 sshd[23374]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:36:54 rmg-web-02 sshd[23374]: Failed password for invalid user admin from 198.51.100.202 port 50720 ssh2
Aug 15 17:36:55 rmg-web-02 sshd[23374]: Connection closed by invalid user admin 198.51.100.202 port 50720 [preauth]
Aug 15 17:37:35 rmg-web-02 sshd[23375]: Invalid user admin from 198.51.100.202 port 59077
Aug 15 17:37:36 rmg-web-02 sshd[23375]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:37:36 rmg-web-02 sshd[23375]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 17:37:38 rmg-web-02 sshd[23375]: Failed password for invalid user admin from 198.51.100.202 port 59077 ssh2
Aug 15 17:37:39 rmg-web-02 sshd[23375]: Connection closed by invalid user admin 198.51.100.202 port 59077 [preauth]
Aug 15 17:38:40 rmg-web-02 sshd[23366]: Invalid user user from 192.0.2.9 port 59012
Aug 15 17:38:41 rmg-web-02 sshd[23366]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 17:38:41 rmg-web-02 sshd[23366]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 17:38:43 rmg-web-02 sshd[23366]: Failed password for invalid user user from 192.0.2.9 port 59012 ssh2
Aug 15 17:38:44 rmg-web-02 sshd[23366]: Connection closed by invalid user user 192.0.2.9 port 59012 [preauth]
Aug 15 17:40:23 rmg-web-02 sshd[22528]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:40:25 rmg-web-02 sshd[22528]: Failed password for nagios from 10.20.9.40 port 46304 ssh2
Aug 15 17:45:10 rmg-web-02 sshd[22531]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:45:12 rmg-web-02 sshd[22531]: Failed password for nagios from 10.20.9.40 port 37954 ssh2
Aug 15 17:50:17 rmg-web-02 sshd[22540]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:50:19 rmg-web-02 sshd[22540]: Failed password for nagios from 10.20.9.40 port 61319 ssh2
Aug 15 17:55:26 rmg-web-02 sshd[22543]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 17:55:28 rmg-web-02 sshd[22543]: Failed password for nagios from 10.20.9.40 port 55888 ssh2
Aug 15 18:00:29 rmg-web-02 sshd[22544]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:00:31 rmg-web-02 sshd[22544]: Failed password for nagios from 10.20.9.40 port 45464 ssh2
Aug 15 18:05:15 rmg-web-02 sshd[22551]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:05:17 rmg-web-02 sshd[22551]: Failed password for nagios from 10.20.9.40 port 59051 ssh2
Aug 15 18:08:36 rmg-web-02 sshd[23395]: Invalid user oracle from 198.51.100.202 port 30360
Aug 15 18:08:37 rmg-web-02 sshd[23395]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:08:37 rmg-web-02 sshd[23395]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 18:08:39 rmg-web-02 sshd[23395]: Failed password for invalid user oracle from 198.51.100.202 port 30360 ssh2
Aug 15 18:08:40 rmg-web-02 sshd[23395]: Connection closed by invalid user oracle 198.51.100.202 port 30360 [preauth]
Aug 15 18:10:15 rmg-web-02 sshd[22560]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:10:17 rmg-web-02 sshd[22560]: Failed password for nagios from 10.20.9.40 port 64235 ssh2
Aug 15 18:15:16 rmg-web-02 sshd[22567]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:15:18 rmg-web-02 sshd[22567]: Failed password for nagios from 10.20.9.40 port 37470 ssh2
Aug 15 18:17:01 rmg-web-02 CRON[22826]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 18:17:01 rmg-web-02 CRON[9290]: pam_unix(cron:session): session closed for user root
Aug 15 18:20:20 rmg-web-02 sshd[22568]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:20:22 rmg-web-02 sshd[22568]: Failed password for nagios from 10.20.9.40 port 57425 ssh2
Aug 15 18:24:17 rmg-web-02 sshd[23411]: Invalid user ubuntu from 203.0.113.12 port 62490
Aug 15 18:24:18 rmg-web-02 sshd[23411]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:24:18 rmg-web-02 sshd[23411]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 18:24:20 rmg-web-02 sshd[23411]: Failed password for invalid user ubuntu from 203.0.113.12 port 62490 ssh2
Aug 15 18:24:21 rmg-web-02 sshd[23411]: Connection closed by invalid user ubuntu 203.0.113.12 port 62490 [preauth]
Aug 15 18:25:05 rmg-web-02 sshd[22572]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:25:07 rmg-web-02 sshd[22572]: Failed password for nagios from 10.20.9.40 port 30609 ssh2
Aug 15 18:26:53 rmg-web-02 sshd[23404]: Invalid user postgres from 203.0.113.12 port 63096
Aug 15 18:26:54 rmg-web-02 sshd[23404]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:26:54 rmg-web-02 sshd[23404]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 18:26:56 rmg-web-02 sshd[23404]: Failed password for invalid user postgres from 203.0.113.12 port 63096 ssh2
Aug 15 18:26:57 rmg-web-02 sshd[23404]: Connection closed by invalid user postgres 203.0.113.12 port 63096 [preauth]
Aug 15 18:30:14 rmg-web-02 sshd[22573]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:30:16 rmg-web-02 sshd[22573]: Failed password for nagios from 10.20.9.40 port 34390 ssh2
Aug 15 18:35:28 rmg-web-02 sshd[22582]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:35:30 rmg-web-02 sshd[22582]: Failed password for nagios from 10.20.9.40 port 31641 ssh2
Aug 15 18:38:16 rmg-web-02 sshd[23387]: Invalid user postgres from 192.0.2.9 port 46571
Aug 15 18:38:17 rmg-web-02 sshd[23387]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 18:38:17 rmg-web-02 sshd[23387]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 18:38:19 rmg-web-02 sshd[23387]: Failed password for invalid user postgres from 192.0.2.9 port 46571 ssh2
Aug 15 18:38:20 rmg-web-02 sshd[23387]: Connection closed by invalid user postgres 192.0.2.9 port 46571 [preauth]
Aug 15 18:40:05 rmg-web-02 sshd[22583]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:40:07 rmg-web-02 sshd[22583]: Failed password for nagios from 10.20.9.40 port 57976 ssh2
Aug 15 18:45:30 rmg-web-02 sshd[22587]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:45:32 rmg-web-02 sshd[22587]: Failed password for nagios from 10.20.9.40 port 35038 ssh2
Aug 15 18:50:13 rmg-web-02 sshd[22589]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:50:15 rmg-web-02 sshd[22589]: Failed password for nagios from 10.20.9.40 port 37815 ssh2
Aug 15 18:55:21 rmg-web-02 sshd[22594]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 18:55:23 rmg-web-02 sshd[22594]: Failed password for nagios from 10.20.9.40 port 34237 ssh2
Aug 15 19:00:09 rmg-web-02 sshd[22598]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:00:11 rmg-web-02 sshd[22598]: Failed password for nagios from 10.20.9.40 port 33120 ssh2
Aug 15 19:02:23 rmg-web-02 sshd[23416]: Invalid user mysql from 198.51.100.23 port 45794
Aug 15 19:02:24 rmg-web-02 sshd[23416]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:02:24 rmg-web-02 sshd[23416]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 19:02:26 rmg-web-02 sshd[23416]: Failed password for invalid user mysql from 198.51.100.23 port 45794 ssh2
Aug 15 19:02:27 rmg-web-02 sshd[23416]: Connection closed by invalid user mysql 198.51.100.23 port 45794 [preauth]
Aug 15 19:05:17 rmg-web-02 sshd[22602]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:05:19 rmg-web-02 sshd[22602]: Failed password for nagios from 10.20.9.40 port 50657 ssh2
Aug 15 19:10:29 rmg-web-02 sshd[22610]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:10:31 rmg-web-02 sshd[22610]: Failed password for nagios from 10.20.9.40 port 61500 ssh2
Aug 15 19:15:29 rmg-web-02 sshd[22613]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:15:31 rmg-web-02 sshd[22613]: Failed password for nagios from 10.20.9.40 port 47739 ssh2
Aug 15 19:17:01 rmg-web-02 CRON[18238]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 19:17:01 rmg-web-02 CRON[17667]: pam_unix(cron:session): session closed for user root
Aug 15 19:20:03 rmg-web-02 sshd[22615]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:20:05 rmg-web-02 sshd[22615]: Failed password for nagios from 10.20.9.40 port 53282 ssh2
Aug 15 19:25:02 rmg-web-02 sshd[22617]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:25:04 rmg-web-02 sshd[22617]: Failed password for nagios from 10.20.9.40 port 43001 ssh2
Aug 15 19:30:05 rmg-web-02 sshd[22622]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:30:07 rmg-web-02 sshd[22622]: Failed password for nagios from 10.20.9.40 port 54237 ssh2
Aug 15 19:34:15 rmg-web-02 sshd[23435]: Invalid user webmaster from 203.0.113.12 port 46835
Aug 15 19:34:16 rmg-web-02 sshd[23435]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:34:16 rmg-web-02 sshd[23435]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 19:34:18 rmg-web-02 sshd[23435]: Failed password for invalid user webmaster from 203.0.113.12 port 46835 ssh2
Aug 15 19:34:19 rmg-web-02 sshd[23435]: Connection closed by invalid user webmaster 203.0.113.12 port 46835 [preauth]
Aug 15 19:35:08 rmg-web-02 sshd[22623]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:35:10 rmg-web-02 sshd[22623]: Failed password for nagios from 10.20.9.40 port 34269 ssh2
Aug 15 19:40:25 rmg-web-02 sshd[22632]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:40:27 rmg-web-02 sshd[22632]: Failed password for nagios from 10.20.9.40 port 38585 ssh2
Aug 15 19:42:45 rmg-web-02 sshd[23426]: Invalid user oracle from 203.0.113.140 port 62910
Aug 15 19:42:46 rmg-web-02 sshd[23426]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:42:46 rmg-web-02 sshd[23426]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 19:42:48 rmg-web-02 sshd[23426]: Failed password for invalid user oracle from 203.0.113.140 port 62910 ssh2
Aug 15 19:42:49 rmg-web-02 sshd[23426]: Connection closed by invalid user oracle 203.0.113.140 port 62910 [preauth]
Aug 15 19:45:23 rmg-web-02 sshd[22636]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:45:25 rmg-web-02 sshd[22636]: Failed password for nagios from 10.20.9.40 port 43815 ssh2
Aug 15 19:48:02 rmg-web-02 sshd[23417]: Invalid user deploy from 192.0.2.171 port 39374
Aug 15 19:48:03 rmg-web-02 sshd[23417]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 19:48:03 rmg-web-02 sshd[23417]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 19:48:05 rmg-web-02 sshd[23417]: Failed password for invalid user deploy from 192.0.2.171 port 39374 ssh2
Aug 15 19:48:06 rmg-web-02 sshd[23417]: Connection closed by invalid user deploy 192.0.2.171 port 39374 [preauth]
Aug 15 19:50:05 rmg-web-02 sshd[22640]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:50:07 rmg-web-02 sshd[22640]: Failed password for nagios from 10.20.9.40 port 55131 ssh2
Aug 15 19:55:16 rmg-web-02 sshd[22649]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 19:55:18 rmg-web-02 sshd[22649]: Failed password for nagios from 10.20.9.40 port 52548 ssh2
Aug 15 20:00:27 rmg-web-02 sshd[22656]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:00:29 rmg-web-02 sshd[22656]: Failed password for nagios from 10.20.9.40 port 58519 ssh2
Aug 15 20:05:10 rmg-web-02 sshd[22665]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:05:12 rmg-web-02 sshd[22665]: Failed password for nagios from 10.20.9.40 port 33579 ssh2
Aug 15 20:10:15 rmg-web-02 sshd[22670]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:10:17 rmg-web-02 sshd[22670]: Failed password for nagios from 10.20.9.40 port 43351 ssh2
Aug 15 20:15:09 rmg-web-02 sshd[22671]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:15:11 rmg-web-02 sshd[22671]: Failed password for nagios from 10.20.9.40 port 59453 ssh2
Aug 15 20:15:51 rmg-web-02 sshd[23442]: Invalid user deploy from 203.0.113.140 port 35895
Aug 15 20:15:52 rmg-web-02 sshd[23442]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:15:52 rmg-web-02 sshd[23442]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.140
Aug 15 20:15:54 rmg-web-02 sshd[23442]: Failed password for invalid user deploy from 203.0.113.140 port 35895 ssh2
Aug 15 20:15:55 rmg-web-02 sshd[23442]: Connection closed by invalid user deploy 203.0.113.140 port 35895 [preauth]
Aug 15 20:17:01 rmg-web-02 CRON[10825]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 20:17:01 rmg-web-02 CRON[19030]: pam_unix(cron:session): session closed for user root
Aug 15 20:17:06 rmg-web-02 sshd[23439]: Invalid user guest from 203.0.113.201 port 46482
Aug 15 20:17:07 rmg-web-02 sshd[23439]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:17:07 rmg-web-02 sshd[23439]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 20:17:09 rmg-web-02 sshd[23439]: Failed password for invalid user guest from 203.0.113.201 port 46482 ssh2
Aug 15 20:17:10 rmg-web-02 sshd[23439]: Connection closed by invalid user guest 203.0.113.201 port 46482 [preauth]
Aug 15 20:20:23 rmg-web-02 sshd[22673]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:20:25 rmg-web-02 sshd[22673]: Failed password for nagios from 10.20.9.40 port 62970 ssh2
Aug 15 20:25:08 rmg-web-02 sshd[22677]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:25:10 rmg-web-02 sshd[22677]: Failed password for nagios from 10.20.9.40 port 52197 ssh2
Aug 15 20:30:02 rmg-web-02 sshd[22680]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:30:04 rmg-web-02 sshd[22680]: Failed password for nagios from 10.20.9.40 port 37001 ssh2
Aug 15 20:35:00 rmg-web-02 sshd[22683]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:35:02 rmg-web-02 sshd[22683]: Failed password for nagios from 10.20.9.40 port 39577 ssh2
Aug 15 20:40:05 rmg-web-02 sshd[22692]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:40:07 rmg-web-02 sshd[22692]: Failed password for nagios from 10.20.9.40 port 47623 ssh2
Aug 15 20:42:58 rmg-web-02 sshd[23449]: Invalid user webmaster from 203.0.113.12 port 44597
Aug 15 20:42:59 rmg-web-02 sshd[23449]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 20:42:59 rmg-web-02 sshd[23449]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 20:43:01 rmg-web-02 sshd[23449]: Failed password for invalid user webmaster from 203.0.113.12 port 44597 ssh2
Aug 15 20:43:02 rmg-web-02 sshd[23449]: Connection closed by invalid user webmaster 203.0.113.12 port 44597 [preauth]
Aug 15 20:45:06 rmg-web-02 sshd[22697]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:45:08 rmg-web-02 sshd[22697]: Failed password for nagios from 10.20.9.40 port 58426 ssh2
Aug 15 20:50:19 rmg-web-02 sshd[22699]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:50:21 rmg-web-02 sshd[22699]: Failed password for nagios from 10.20.9.40 port 32593 ssh2
Aug 15 20:55:07 rmg-web-02 sshd[22704]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 20:55:09 rmg-web-02 sshd[22704]: Failed password for nagios from 10.20.9.40 port 58450 ssh2
Aug 15 21:00:21 rmg-web-02 sshd[22711]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:00:23 rmg-web-02 sshd[22711]: Failed password for nagios from 10.20.9.40 port 54528 ssh2
Aug 15 21:03:36 rmg-web-02 sshd[23460]: Invalid user webmaster from 198.51.100.202 port 42308
Aug 15 21:03:37 rmg-web-02 sshd[23460]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:03:37 rmg-web-02 sshd[23460]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.202
Aug 15 21:03:39 rmg-web-02 sshd[23460]: Failed password for invalid user webmaster from 198.51.100.202 port 42308 ssh2
Aug 15 21:03:40 rmg-web-02 sshd[23460]: Connection closed by invalid user webmaster 198.51.100.202 port 42308 [preauth]
Aug 15 21:05:07 rmg-web-02 sshd[22718]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:05:09 rmg-web-02 sshd[22718]: Failed password for nagios from 10.20.9.40 port 42226 ssh2
Aug 15 21:10:06 rmg-web-02 sshd[22727]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:10:08 rmg-web-02 sshd[22727]: Failed password for nagios from 10.20.9.40 port 33344 ssh2
Aug 15 21:13:58 rmg-web-02 sshd[23480]: Invalid user deploy from 192.0.2.171 port 48495
Aug 15 21:13:59 rmg-web-02 sshd[23480]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:13:59 rmg-web-02 sshd[23480]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 21:14:01 rmg-web-02 sshd[23480]: Failed password for invalid user deploy from 192.0.2.171 port 48495 ssh2
Aug 15 21:14:02 rmg-web-02 sshd[23480]: Connection closed by invalid user deploy 192.0.2.171 port 48495 [preauth]
Aug 15 21:15:03 rmg-web-02 sshd[22734]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:15:05 rmg-web-02 sshd[22734]: Failed password for nagios from 10.20.9.40 port 56964 ssh2
Aug 15 21:16:02 rmg-web-02 sshd[23469]: Invalid user user from 192.0.2.171 port 36896
Aug 15 21:16:03 rmg-web-02 sshd[23469]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:16:03 rmg-web-02 sshd[23469]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 21:16:05 rmg-web-02 sshd[23469]: Failed password for invalid user user from 192.0.2.171 port 36896 ssh2
Aug 15 21:16:06 rmg-web-02 sshd[23469]: Connection closed by invalid user user 192.0.2.171 port 36896 [preauth]
Aug 15 21:17:01 rmg-web-02 CRON[24854]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 21:17:01 rmg-web-02 CRON[10717]: pam_unix(cron:session): session closed for user root
Aug 15 21:20:20 rmg-web-02 sshd[22739]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:20:22 rmg-web-02 sshd[22739]: Failed password for nagios from 10.20.9.40 port 45189 ssh2
Aug 15 21:25:22 rmg-web-02 sshd[22747]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:25:24 rmg-web-02 sshd[22747]: Failed password for nagios from 10.20.9.40 port 41190 ssh2
Aug 15 21:30:02 rmg-web-02 sshd[22749]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:30:04 rmg-web-02 sshd[22749]: Failed password for nagios from 10.20.9.40 port 53995 ssh2
Aug 15 21:34:04 rmg-web-02 sshd[23477]: Invalid user deploy from 192.0.2.44 port 32881
Aug 15 21:34:05 rmg-web-02 sshd[23477]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:34:05 rmg-web-02 sshd[23477]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 21:34:07 rmg-web-02 sshd[23477]: Failed password for invalid user deploy from 192.0.2.44 port 32881 ssh2
Aug 15 21:34:08 rmg-web-02 sshd[23477]: Connection closed by invalid user deploy 192.0.2.44 port 32881 [preauth]
Aug 15 21:35:23 rmg-web-02 sshd[22750]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:35:25 rmg-web-02 sshd[22750]: Failed password for nagios from 10.20.9.40 port 60265 ssh2
Aug 15 21:40:03 rmg-web-02 sshd[22752]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:40:05 rmg-web-02 sshd[22752]: Failed password for nagios from 10.20.9.40 port 60913 ssh2
Aug 15 21:45:12 rmg-web-02 sshd[22755]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:45:14 rmg-web-02 sshd[22755]: Failed password for nagios from 10.20.9.40 port 53482 ssh2
Aug 15 21:50:08 rmg-web-02 sshd[22757]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:50:10 rmg-web-02 sshd[22757]: Failed password for nagios from 10.20.9.40 port 40967 ssh2
Aug 15 21:50:28 rmg-web-02 sshd[23454]: Invalid user admin from 192.0.2.44 port 49967
Aug 15 21:50:29 rmg-web-02 sshd[23454]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 21:50:29 rmg-web-02 sshd[23454]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 21:50:31 rmg-web-02 sshd[23454]: Failed password for invalid user admin from 192.0.2.44 port 49967 ssh2
Aug 15 21:50:32 rmg-web-02 sshd[23454]: Connection closed by invalid user admin 192.0.2.44 port 49967 [preauth]
Aug 15 21:55:25 rmg-web-02 sshd[22765]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 21:55:27 rmg-web-02 sshd[22765]: Failed password for nagios from 10.20.9.40 port 34804 ssh2
Aug 15 22:00:22 rmg-web-02 sshd[22768]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:00:24 rmg-web-02 sshd[22768]: Failed password for nagios from 10.20.9.40 port 57551 ssh2
Aug 15 22:05:07 rmg-web-02 sshd[22774]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:05:09 rmg-web-02 sshd[22774]: Failed password for nagios from 10.20.9.40 port 44800 ssh2
Aug 15 22:10:14 rmg-web-02 sshd[22778]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:10:16 rmg-web-02 sshd[22778]: Failed password for nagios from 10.20.9.40 port 48350 ssh2
Aug 15 22:15:15 rmg-web-02 sshd[22779]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:15:17 rmg-web-02 sshd[22779]: Failed password for nagios from 10.20.9.40 port 40966 ssh2
Aug 15 22:15:17 rmg-web-02 sshd[23505]: Invalid user ubuntu from 203.0.113.12 port 60195
Aug 15 22:15:18 rmg-web-02 sshd[23505]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:15:18 rmg-web-02 sshd[23505]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 22:15:20 rmg-web-02 sshd[23505]: Failed password for invalid user ubuntu from 203.0.113.12 port 60195 ssh2
Aug 15 22:15:21 rmg-web-02 sshd[23505]: Connection closed by invalid user ubuntu 203.0.113.12 port 60195 [preauth]
Aug 15 22:17:01 rmg-web-02 CRON[12834]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 22:17:01 rmg-web-02 CRON[18879]: pam_unix(cron:session): session closed for user root
Aug 15 22:20:08 rmg-web-02 sshd[22784]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:20:10 rmg-web-02 sshd[22784]: Failed password for nagios from 10.20.9.40 port 35866 ssh2
Aug 15 22:25:19 rmg-web-02 sshd[22789]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:25:21 rmg-web-02 sshd[22789]: Failed password for nagios from 10.20.9.40 port 53923 ssh2
Aug 15 22:26:03 rmg-web-02 sshd[23488]: Invalid user support from 203.0.113.12 port 50472
Aug 15 22:26:04 rmg-web-02 sshd[23488]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:26:04 rmg-web-02 sshd[23488]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 22:26:06 rmg-web-02 sshd[23488]: Failed password for invalid user support from 203.0.113.12 port 50472 ssh2
Aug 15 22:26:07 rmg-web-02 sshd[23488]: Connection closed by invalid user support 203.0.113.12 port 50472 [preauth]
Aug 15 22:28:56 rmg-web-02 sshd[23501]: Invalid user ubuntu from 192.0.2.9 port 34992
Aug 15 22:28:57 rmg-web-02 sshd[23501]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:28:57 rmg-web-02 sshd[23501]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.9
Aug 15 22:28:59 rmg-web-02 sshd[23501]: Failed password for invalid user ubuntu from 192.0.2.9 port 34992 ssh2
Aug 15 22:29:00 rmg-web-02 sshd[23501]: Connection closed by invalid user ubuntu 192.0.2.9 port 34992 [preauth]
Aug 15 22:30:21 rmg-web-02 sshd[22793]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:30:23 rmg-web-02 sshd[22793]: Failed password for nagios from 10.20.9.40 port 37106 ssh2
Aug 15 22:35:21 rmg-web-02 sshd[22800]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:35:23 rmg-web-02 sshd[22800]: Failed password for nagios from 10.20.9.40 port 43230 ssh2
Aug 15 22:40:00 rmg-web-02 sshd[22808]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:40:02 rmg-web-02 sshd[22808]: Failed password for nagios from 10.20.9.40 port 36155 ssh2
Aug 15 22:41:12 rmg-web-02 sshd[23484]: Invalid user support from 192.0.2.171 port 32858
Aug 15 22:41:13 rmg-web-02 sshd[23484]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:41:13 rmg-web-02 sshd[23484]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 22:41:15 rmg-web-02 sshd[23484]: Failed password for invalid user support from 192.0.2.171 port 32858 ssh2
Aug 15 22:41:16 rmg-web-02 sshd[23484]: Connection closed by invalid user support 192.0.2.171 port 32858 [preauth]
Aug 15 22:45:07 rmg-web-02 sshd[22814]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:45:09 rmg-web-02 sshd[22814]: Failed password for nagios from 10.20.9.40 port 60855 ssh2
Aug 15 22:50:18 rmg-web-02 sshd[22817]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:50:20 rmg-web-02 sshd[22817]: Failed password for nagios from 10.20.9.40 port 39816 ssh2
Aug 15 22:53:11 rmg-web-02 sshd[23493]: Invalid user mysql from 198.51.100.23 port 42228
Aug 15 22:53:12 rmg-web-02 sshd[23493]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:53:12 rmg-web-02 sshd[23493]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 22:53:14 rmg-web-02 sshd[23493]: Failed password for invalid user mysql from 198.51.100.23 port 42228 ssh2
Aug 15 22:53:15 rmg-web-02 sshd[23493]: Connection closed by invalid user mysql 198.51.100.23 port 42228 [preauth]
Aug 15 22:55:12 rmg-web-02 sshd[22819]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 22:55:14 rmg-web-02 sshd[22819]: Failed password for nagios from 10.20.9.40 port 43456 ssh2
Aug 15 22:57:49 rmg-web-02 sshd[23483]: Invalid user user from 192.0.2.171 port 31423
Aug 15 22:57:50 rmg-web-02 sshd[23483]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 22:57:50 rmg-web-02 sshd[23483]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.171
Aug 15 22:57:52 rmg-web-02 sshd[23483]: Failed password for invalid user user from 192.0.2.171 port 31423 ssh2
Aug 15 22:57:53 rmg-web-02 sshd[23483]: Connection closed by invalid user user 192.0.2.171 port 31423 [preauth]
Aug 15 23:00:10 rmg-web-02 sshd[22824]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:00:12 rmg-web-02 sshd[22824]: Failed password for nagios from 10.20.9.40 port 35805 ssh2
Aug 15 23:05:25 rmg-web-02 sshd[22830]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:05:27 rmg-web-02 sshd[22830]: Failed password for nagios from 10.20.9.40 port 30953 ssh2
Aug 15 23:08:00 rmg-web-02 sshd[23527]: Invalid user git from 203.0.113.201 port 47257
Aug 15 23:08:01 rmg-web-02 sshd[23527]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:08:01 rmg-web-02 sshd[23527]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:08:03 rmg-web-02 sshd[23527]: Failed password for invalid user git from 203.0.113.201 port 47257 ssh2
Aug 15 23:08:04 rmg-web-02 sshd[23527]: Connection closed by invalid user git 203.0.113.201 port 47257 [preauth]
Aug 15 23:10:23 rmg-web-02 sshd[22831]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:10:25 rmg-web-02 sshd[22831]: Failed password for nagios from 10.20.9.40 port 64135 ssh2
Aug 15 23:15:01 rmg-web-02 sshd[22839]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:15:03 rmg-web-02 sshd[22839]: Failed password for nagios from 10.20.9.40 port 35132 ssh2
Aug 15 23:17:01 rmg-web-02 CRON[27619]: pam_unix(cron:session): session opened for user root(uid=0) by (uid=0)
Aug 15 23:17:01 rmg-web-02 CRON[21422]: pam_unix(cron:session): session closed for user root
Aug 15 23:20:03 rmg-web-02 sshd[22841]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:20:05 rmg-web-02 sshd[22841]: Failed password for nagios from 10.20.9.40 port 57802 ssh2
Aug 15 23:20:24 rmg-web-02 sshd[23530]: Invalid user guest from 192.0.2.44 port 58418
Aug 15 23:20:25 rmg-web-02 sshd[23530]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:20:25 rmg-web-02 sshd[23530]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=192.0.2.44
Aug 15 23:20:27 rmg-web-02 sshd[23530]: Failed password for invalid user guest from 192.0.2.44 port 58418 ssh2
Aug 15 23:20:28 rmg-web-02 sshd[23530]: Connection closed by invalid user guest 192.0.2.44 port 58418 [preauth]
Aug 15 23:25:20 rmg-web-02 sshd[22843]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:25:22 rmg-web-02 sshd[22843]: Failed password for nagios from 10.20.9.40 port 53444 ssh2
Aug 15 23:30:12 rmg-web-02 sshd[22849]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:30:14 rmg-web-02 sshd[22849]: Failed password for nagios from 10.20.9.40 port 44305 ssh2
Aug 15 23:35:06 rmg-web-02 sshd[22856]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:35:08 rmg-web-02 sshd[22856]: Failed password for nagios from 10.20.9.40 port 50137 ssh2
Aug 15 23:36:44 rmg-web-02 sshd[23520]: Invalid user webmaster from 203.0.113.201 port 48542
Aug 15 23:36:45 rmg-web-02 sshd[23520]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:36:45 rmg-web-02 sshd[23520]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:36:47 rmg-web-02 sshd[23520]: Failed password for invalid user webmaster from 203.0.113.201 port 48542 ssh2
Aug 15 23:36:48 rmg-web-02 sshd[23520]: Connection closed by invalid user webmaster 203.0.113.201 port 48542 [preauth]
Aug 15 23:40:06 rmg-web-02 sshd[22857]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:40:08 rmg-web-02 sshd[22857]: Failed password for nagios from 10.20.9.40 port 57549 ssh2
Aug 15 23:44:51 rmg-web-02 sshd[23521]: Invalid user git from 203.0.113.201 port 31422
Aug 15 23:44:52 rmg-web-02 sshd[23521]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:44:52 rmg-web-02 sshd[23521]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.201
Aug 15 23:44:54 rmg-web-02 sshd[23521]: Failed password for invalid user git from 203.0.113.201 port 31422 ssh2
Aug 15 23:44:55 rmg-web-02 sshd[23521]: Connection closed by invalid user git 203.0.113.201 port 31422 [preauth]
Aug 15 23:45:04 rmg-web-02 sshd[22858]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:45:06 rmg-web-02 sshd[22858]: Failed password for nagios from 10.20.9.40 port 53246 ssh2
Aug 15 23:45:53 rmg-web-02 sshd[23512]: Invalid user support from 203.0.113.12 port 42701
Aug 15 23:45:54 rmg-web-02 sshd[23512]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:45:54 rmg-web-02 sshd[23512]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=203.0.113.12
Aug 15 23:45:56 rmg-web-02 sshd[23512]: Failed password for invalid user support from 203.0.113.12 port 42701 ssh2
Aug 15 23:45:57 rmg-web-02 sshd[23512]: Connection closed by invalid user support 203.0.113.12 port 42701 [preauth]
Aug 15 23:48:54 rmg-web-02 sshd[23508]: Invalid user git from 198.51.100.23 port 45635
Aug 15 23:48:55 rmg-web-02 sshd[23508]: pam_unix(sshd:auth): check pass; user unknown
Aug 15 23:48:55 rmg-web-02 sshd[23508]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=198.51.100.23
Aug 15 23:48:57 rmg-web-02 sshd[23508]: Failed password for invalid user git from 198.51.100.23 port 45635 ssh2
Aug 15 23:48:58 rmg-web-02 sshd[23508]: Connection closed by invalid user git 198.51.100.23 port 45635 [preauth]
Aug 15 23:50:15 rmg-web-02 sshd[22863]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:50:17 rmg-web-02 sshd[22863]: Failed password for nagios from 10.20.9.40 port 30266 ssh2
Aug 15 23:55:29 rmg-web-02 sshd[22868]: pam_unix(sshd:auth): authentication failure; logname= uid=0 euid=0 tty=ssh ruser= rhost=10.20.9.40  user=nagios
Aug 15 23:55:31 rmg-web-02 sshd[22868]: Failed password for nagios from 10.20.9.40 port 34494 ssh2`;

/** 222 lines of system events for Aug 15. */
export const SYSLOG = `Aug 15 00:00:08 rmg-web-02 systemd[1]: logrotate.service: Succeeded.
Aug 15 00:00:08 rmg-web-02 systemd[1]: Finished Rotate log files.
Aug 15 00:03:12 rmg-web-02 kernel: [86412.339481] EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode.
Aug 15 00:06:09 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 00:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 00:17:01 rmg-web-02 CRON[27556]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 00:30:50 rmg-web-02 kernel: [120701.545320] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.44 DST=10.20.6.40 PROTO=TCP SPT=54402 DPT=5900
Aug 15 01:17:01 rmg-web-02 CRON[15726]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 01:30:15 rmg-web-02 systemd[1]: Started Ridgeline nightly backup.
Aug 15 01:52:41 rmg-web-02 backup-agent[3312]: snapshot complete: 41.7 GB transferred to rmg-backup-01
Aug 15 01:52:42 rmg-web-02 systemd[1]: rmg-backup.service: Succeeded.
Aug 15 02:06:36 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 02:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 02:17:01 rmg-web-02 CRON[17111]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 03:12:44 rmg-web-02 systemd[1]: Stopping PostgreSQL RDBMS...
Aug 15 03:12:47 rmg-web-02 postgresql[1841]: server stopped
Aug 15 03:12:51 rmg-web-02 systemd[1]: Started PostgreSQL RDBMS.
Aug 15 03:12:52 rmg-web-02 postgresql[2033]: database system was not properly shut down; automatic recovery in progress
Aug 15 03:12:55 rmg-web-02 postgresql[2033]: redo done at 0/1A2F3C8
Aug 15 03:12:56 rmg-web-02 postgresql[2033]: database system is ready to accept connections
Aug 15 03:17:01 rmg-web-02 CRON[17041]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 03:35:55 rmg-web-02 kernel: [105563.664807] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.9 DST=10.20.6.40 PROTO=TCP SPT=56443 DPT=8080
Aug 15 04:06:39 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 04:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 04:17:01 rmg-web-02 CRON[29679]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 04:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 05:17:01 rmg-web-02 CRON[18660]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 06:06:52 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 06:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 06:17:01 rmg-web-02 CRON[22758]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 06:41:02 rmg-web-02 kernel: [108234.771290] audit: type=1400 apparmor="DENIED" operation="open" profile="/usr/sbin/nginx" name="/proc/1422/oom_score_adj"
Aug 15 06:49:00 rmg-web-02 kernel: [84449.267623] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.23 DST=10.20.6.40 PROTO=TCP SPT=44348 DPT=445
Aug 15 07:05:30 rmg-web-02 postfix/qmgr[1104]: 56D76: from=<noreply@ridgelinemed.example>, size=7459, nrcpt=1 (queue active)
Aug 15 07:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 07:06:08 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.047
Aug 15 07:13:18 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.136
Aug 15 07:17:01 rmg-web-02 CRON[18716]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 07:42:16 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.019
Aug 15 07:42:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.026
Aug 15 07:45:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.076
Aug 15 07:46:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.070
Aug 15 07:52:19 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.022
Aug 15 07:56:54 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.083
Aug 15 07:58:23 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 08:05:23 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.021
Aug 15 08:06:22 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 08:06:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Aug 15 08:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 08:11:33 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.076
Aug 15 08:14:06 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.032
Aug 15 08:17:01 rmg-web-02 CRON[27919]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 08:21:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.070
Aug 15 08:24:09 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.062
Aug 15 08:25:14 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.079
Aug 15 08:27:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.034
Aug 15 08:34:02 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.033
Aug 15 08:41:56 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.120
Aug 15 08:46:54 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.033
Aug 15 08:58:55 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 09:05:34 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.040
Aug 15 09:17:01 rmg-web-02 CRON[27365]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 09:18:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.057
Aug 15 09:19:14 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.117
Aug 15 09:19:15 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.087
Aug 15 09:19:42 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.053
Aug 15 09:26:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.016
Aug 15 09:27:34 rmg-web-02 kernel: [97993.101616] [UFW BLOCK] IN=eth0 OUT= SRC=203.0.113.12 DST=10.20.6.40 PROTO=TCP SPT=42431 DPT=8080
Aug 15 09:33:06 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.037
Aug 15 09:34:09 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.078
Aug 15 09:37:26 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.051
Aug 15 09:41:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.038
Aug 15 09:45:32 rmg-web-02 nginx[1422]: patient-portal: 404 GET /admin/config.php upstream=- rt=0.001
Aug 15 09:53:46 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.056
Aug 15 10:06:38 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 10:06:50 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.080
Aug 15 10:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 10:08:35 rmg-web-02 nginx[1422]: patient-portal: 404 GET /wp-login.php upstream=- rt=0.001
Aug 15 10:10:07 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.011
Aug 15 10:12:31 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.025
Aug 15 10:14:23 rmg-web-02 systemd-logind[912]: New session 4821 of user testuser.
Aug 15 10:14:23 rmg-web-02 systemd[1]: Started Session 4821 of user testuser.
Aug 15 10:17:01 rmg-web-02 CRON[13396]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 10:18:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.083
Aug 15 10:20:53 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.052
Aug 15 10:22:43 rmg-web-02 systemd-logind[912]: New session 4822 of user root.
Aug 15 10:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 10:27:01 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.025
Aug 15 10:37:57 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.088
Aug 15 10:40:52 rmg-web-02 cron[878]: (sysmon) RELOAD (crontabs/sysmon)
Aug 15 10:45:00 rmg-web-02 CRON[25501]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 10:49:12 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.165
Aug 15 10:52:31 rmg-web-02 systemd-logind[912]: Removed session 4821.
Aug 15 10:58:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.079
Aug 15 11:00:00 rmg-web-02 CRON[25604]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 11:01:40 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.142
Aug 15 11:05:15 rmg-web-02 systemd-logind[912]: New session 4830 of user sysmon.
Aug 15 11:05:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.081
Aug 15 11:08:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.018
Aug 15 11:09:24 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.048
Aug 15 11:12:08 rmg-web-02 kernel: [124901.220417] nf_conntrack: table full, dropping packet
Aug 15 11:12:30 rmg-web-02 kernel: [124923.884012] TCP: out-of-order packets from 198.51.100.60
Aug 15 11:15:00 rmg-web-02 CRON[25702]: (sysmon) CMD (curl -s https://198.51.100.60/b -o /tmp/.cache/u && bash /tmp/.cache/u)
Aug 15 11:17:01 rmg-web-02 CRON[20001]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 11:25:31 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.030
Aug 15 11:28:30 rmg-web-02 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Aug 15 11:31:56 rmg-web-02 systemd-logind[912]: Removed session 4830.
Aug 15 11:34:02 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.075
Aug 15 11:44:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.048
Aug 15 11:49:20 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.035
Aug 15 11:54:40 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.046
Aug 15 11:57:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.060
Aug 15 12:03:28 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.072
Aug 15 12:05:11 rmg-web-02 postfix/qmgr[1104]: D6504: from=<noreply@ridgelinemed.example>, size=2541, nrcpt=1 (queue active)
Aug 15 12:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 12:06:10 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 12:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 12:10:14 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.069
Aug 15 12:13:32 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.148
Aug 15 12:13:43 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.057
Aug 15 12:17:01 rmg-web-02 CRON[10503]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 12:17:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.077
Aug 15 12:27:11 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.050
Aug 15 12:29:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.014
Aug 15 12:30:18 rmg-web-02 kernel: [93079.537606] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.44 DST=10.20.6.40 PROTO=TCP SPT=46888 DPT=5900
Aug 15 12:30:58 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 12:34:25 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.060
Aug 15 12:43:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.040
Aug 15 13:02:44 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 13:03:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.065
Aug 15 13:05:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.030
Aug 15 13:14:17 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.075
Aug 15 13:17:01 rmg-web-02 CRON[9393]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 13:20:35 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.068
Aug 15 13:28:19 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.138
Aug 15 13:28:49 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.057
Aug 15 13:32:00 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.069
Aug 15 13:35:34 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 13:39:53 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.029
Aug 15 13:48:04 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.057
Aug 15 13:48:58 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 14:01:29 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.072
Aug 15 14:02:08 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.059
Aug 15 14:05:00 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.035
Aug 15 14:06:17 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 14:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 14:08:14 rmg-web-02 nginx[1422]: patient-portal: 404 GET /vendor/phpunit upstream=- rt=0.001
Aug 15 14:17:01 rmg-web-02 CRON[11584]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 14:19:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.055
Aug 15 14:29:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.049
Aug 15 14:32:04 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.028
Aug 15 14:33:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.024
Aug 15 14:38:41 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.123
Aug 15 15:12:55 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.056
Aug 15 15:13:36 rmg-web-02 kernel: [123981.470835] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.9 DST=10.20.6.40 PROTO=TCP SPT=47004 DPT=23
Aug 15 15:17:01 rmg-web-02 CRON[19857]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 15:20:45 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.043
Aug 15 15:30:21 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 15:32:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.045
Aug 15 15:33:05 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.039
Aug 15 15:33:10 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.065
Aug 15 15:42:37 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.076
Aug 15 15:43:21 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.193
Aug 15 15:43:34 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.053
Aug 15 15:47:03 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.076
Aug 15 15:50:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.057
Aug 15 16:06:27 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.048
Aug 15 16:06:45 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 16:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 16:15:51 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.038
Aug 15 16:17:01 rmg-web-02 CRON[15002]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 16:21:10 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 16:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 16:27:56 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/billing/statements upstream=127.0.0.1:8080 rt=0.085
Aug 15 16:28:37 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.043
Aug 15 16:30:07 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 16:35:47 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.110
Aug 15 16:40:50 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/profile upstream=127.0.0.1:8080 rt=0.071
Aug 15 16:43:52 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.040
Aug 15 16:51:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.081
Aug 15 16:52:34 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 17:01:18 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.039
Aug 15 17:03:22 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.086
Aug 15 17:05:03 rmg-web-02 nginx[1422]: patient-portal: 404 GET /phpmyadmin/ upstream=- rt=0.001
Aug 15 17:05:37 rmg-web-02 postfix/qmgr[1104]: 854DA: from=<noreply@ridgelinemed.example>, size=8875, nrcpt=1 (queue active)
Aug 15 17:05:38 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.072
Aug 15 17:05:55 rmg-web-02 postfix/smtp[1131]: delivered to mailhost 10.20.7.10, status=sent
Aug 15 17:10:01 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.021
Aug 15 17:12:32 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.031
Aug 15 17:17:01 rmg-web-02 CRON[10072]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 17:21:16 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.042
Aug 15 17:24:21 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.072
Aug 15 17:25:49 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.162
Aug 15 17:46:28 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.065
Aug 15 17:54:30 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.039
Aug 15 18:05:19 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/appointments upstream=127.0.0.1:8080 rt=0.027
Aug 15 18:06:30 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 18:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 18:07:13 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.040
Aug 15 18:17:01 rmg-web-02 CRON[26978]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 18:20:07 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.065
Aug 15 18:25:10 rmg-web-02 nginx[1422]: patient-portal: 200 POST /portal/api/session upstream=127.0.0.1:8080 rt=0.157
Aug 15 18:25:17 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.054
Aug 15 18:30:00 rmg-web-02 systemd[1]: Starting Daily apt download activities...
Aug 15 18:31:12 rmg-web-02 systemd[1]: apt-daily.service: Succeeded.
Aug 15 18:32:22 rmg-web-02 nginx[1422]: patient-portal: 502 GET /portal/api/labs upstream=127.0.0.1:8080 rt=30.001
Aug 15 18:38:57 rmg-web-02 kernel: [100565.288496] [UFW BLOCK] IN=eth0 OUT= SRC=198.51.100.202 DST=10.20.6.40 PROTO=TCP SPT=42444 DPT=445
Aug 15 18:43:59 rmg-web-02 portal-app[8080]: ERROR upstream timeout contacting lab-interface at 10.20.7.22:9443 after 30s
Aug 15 18:46:58 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.071
Aug 15 18:48:26 rmg-web-02 nginx[1422]: patient-portal: 404 GET /.env upstream=- rt=0.001
Aug 15 18:49:52 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/messages upstream=127.0.0.1:8080 rt=0.066
Aug 15 18:58:12 rmg-web-02 nginx[1422]: patient-portal: 200 GET /portal/results/summary upstream=127.0.0.1:8080 rt=0.086
Aug 15 19:17:01 rmg-web-02 CRON[19898]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 20:06:53 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 20:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 20:17:01 rmg-web-02 CRON[9838]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 21:17:01 rmg-web-02 CRON[27558]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 21:20:26 rmg-web-02 kernel: [122406.367722] [UFW BLOCK] IN=eth0 OUT= SRC=192.0.2.171 DST=10.20.6.40 PROTO=TCP SPT=58570 DPT=3389
Aug 15 22:06:02 rmg-web-02 systemd[1]: Starting Refresh fwupd metadata and update motd...
Aug 15 22:06:59 rmg-web-02 systemd[1]: fwupd-refresh.service: Succeeded.
Aug 15 22:17:01 rmg-web-02 CRON[15117]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)
Aug 15 22:25:00 rmg-web-02 disk-monitor[2210]: WARNING: /var is 87% full (threshold 85%)
Aug 15 23:17:01 rmg-web-02 CRON[9172]: (root) CMD (cd / && run-parts --report /etc/cron.hourly)`;
